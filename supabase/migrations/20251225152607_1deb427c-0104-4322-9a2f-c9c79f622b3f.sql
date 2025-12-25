-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for proper role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_segmentation table (invisible to users, for pricing/personalization)
CREATE TABLE public.user_segmentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    career_stage TEXT CHECK (career_stage IN ('student', 'fresher', 'professional', 'senior', 'executive')),
    target_role TEXT,
    target_industry TEXT,
    years_experience INTEGER DEFAULT 0,
    urgency_level TEXT CHECK (urgency_level IN ('exploring', 'active', 'interview_scheduled', 'emergency')),
    visit_count INTEGER DEFAULT 1,
    first_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    geography TEXT DEFAULT 'global',
    currency TEXT DEFAULT 'USD',
    resume_quality_score INTEGER,
    ats_risk_level TEXT CHECK (ats_risk_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resumes table
CREATE TABLE public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Untitled Resume',
    template_id TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    state TEXT NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'imported', 'improved', 'finalized')),
    ats_score INTEGER,
    resume_score TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume_versions table for version history
CREATE TABLE public.resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
    version INTEGER NOT NULL,
    content JSONB NOT NULL,
    ats_score INTEGER,
    resume_score TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_segmentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_segmentation (only system/admin can write, user can read own)
CREATE POLICY "Users can view own segmentation"
ON public.user_segmentation FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own segmentation"
ON public.user_segmentation FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own segmentation"
ON public.user_segmentation FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for resumes
CREATE POLICY "Users can view own resumes"
ON public.resumes FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes"
ON public.resumes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
ON public.resumes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
ON public.resumes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for resume_versions
CREATE POLICY "Users can view own resume versions"
ON public.resume_versions FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.resumes
    WHERE resumes.id = resume_versions.resume_id
    AND resumes.user_id = auth.uid()
));

CREATE POLICY "Users can create versions for own resumes"
ON public.resume_versions FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM public.resumes
    WHERE resumes.id = resume_versions.resume_id
    AND resumes.user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_segmentation_updated_at
BEFORE UPDATE ON public.user_segmentation
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at
BEFORE UPDATE ON public.resumes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    INSERT INTO public.user_segmentation (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_resumes_state ON public.resumes(state);
CREATE INDEX idx_resume_versions_resume_id ON public.resume_versions(resume_id);
CREATE INDEX idx_user_segmentation_user_id ON public.user_segmentation(user_id);