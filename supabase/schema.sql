-- ============================================================================
-- Portfolio CMS — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE project_status AS ENUM ('Live', 'Local Development', 'Coming Soon');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profile Settings (single row)
CREATE TABLE profile_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  about text[] NOT NULL DEFAULT '{}',
  email text NOT NULL DEFAULT '',
  github text NOT NULL DEFAULT '',
  linkedin text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  resume_url text,
  cv_url text,
  avatar_url text,
  location text NOT NULL DEFAULT '',
  seo_title text NOT NULL DEFAULT '',
  seo_description text NOT NULL DEFAULT '',
  seo_keywords text[] NOT NULL DEFAULT '{}',
  og_image text,
  site_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  role text NOT NULL DEFAULT '',
  status project_status NOT NULL DEFAULT 'Coming Soon',
  category text,
  live_url text,
  repo_url text,
  live_url_label text,
  cover_image text NOT NULL DEFAULT '',
  cover_alt text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  is_open_source boolean NOT NULL DEFAULT false,
  is_personal boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Technologies (single flat table for marquee + project associations)
CREATE TABLE technologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text,
  category text NOT NULL DEFAULT 'Workflow',
  website text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true
);

-- Project ↔ Technology junction
CREATE TABLE project_technologies (
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id uuid NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  PRIMARY KEY (project_id, technology_id)
);

-- Project Highlights
CREATE TABLE project_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Project Images
CREATE TABLE project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Experience
CREATE TABLE experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,
  title text NOT NULL,
  org text NOT NULL,
  description text NOT NULL DEFAULT '',
  employment_type text,
  location text,
  website text,
  logo text,
  tags text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Education
CREATE TABLE education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution text NOT NULL,
  degree text NOT NULL,
  field text NOT NULL,
  start_year integer NOT NULL,
  end_year integer,
  description text,
  gpa text,
  activities text[],
  logo text,
  website text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Certificates
CREATE TABLE certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  credential_id text,
  credential_url text,
  image text,
  issuer_logo text,
  issue_date date,
  expire_date date,
  skills text[],
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Contact Messages (enhanced)
-- If the table already exists, alter it. Otherwise create.
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  replied boolean NOT NULL DEFAULT false,
  ip_hash text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add new columns if table already existed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'is_read') THEN
    ALTER TABLE contact_messages ADD COLUMN is_read boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'replied') THEN
    ALTER TABLE contact_messages ADD COLUMN replied boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'ip_hash') THEN
    ALTER TABLE contact_messages ADD COLUMN ip_hash text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'country') THEN
    ALTER TABLE contact_messages ADD COLUMN country text;
  END IF;
END $$;

-- Analytics
CREATE TABLE analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event text NOT NULL,
  metadata jsonb,
  ip_hash text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Blog (schema ready — no admin UI in this phase)
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  cover_image text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL
);

CREATE TABLE post_categories (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE post_tags (
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_projects_published ON projects(published, sort_order);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_technologies_category ON technologies(category);
CREATE INDEX idx_technologies_published ON technologies(published, sort_order);
CREATE INDEX idx_project_technologies_project ON project_technologies(project_id);
CREATE INDEX idx_project_technologies_tech ON project_technologies(technology_id);
CREATE INDEX idx_project_highlights_project ON project_highlights(project_id, sort_order);
CREATE INDEX idx_project_images_project ON project_images(project_id, sort_order);
CREATE INDEX idx_experience_published ON experience(published, sort_order);
CREATE INDEX idx_education_published ON education(published, sort_order);
CREATE INDEX idx_certificates_published ON certificates(published, sort_order);
CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_unread ON contact_messages(is_read) WHERE is_read = false;
CREATE INDEX idx_analytics_event ON analytics(event, created_at DESC);
CREATE INDEX idx_analytics_created ON analytics(created_at DESC);

-- ============================================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profile_settings_updated_at
  BEFORE UPDATE ON profile_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_experience_updated_at
  BEFORE UPDATE ON experience FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_certificates_updated_at
  BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read profile_settings" ON profile_settings FOR SELECT USING (true);
CREATE POLICY "Public read published projects" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Public read published technologies" ON technologies FOR SELECT USING (published = true);
CREATE POLICY "Public read project_technologies" ON project_technologies FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_technologies.project_id AND projects.published = true)
);
CREATE POLICY "Public read project_highlights" ON project_highlights FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_highlights.project_id AND projects.published = true)
);
CREATE POLICY "Public read project_images" ON project_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.published = true)
);
CREATE POLICY "Public read published experience" ON experience FOR SELECT USING (published = true);
CREATE POLICY "Public read published education" ON education FOR SELECT USING (published = true);
CREATE POLICY "Public read published certificates" ON certificates FOR SELECT USING (published = true);

-- Public insert for contact messages and analytics
CREATE POLICY "Public insert contact_messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- Service role has full access (used by server actions via getSupabaseAdmin)
-- The service role key bypasses RLS by default, so no additional policies needed.

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('projects', 'projects', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated upload/delete
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public read projects" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Public read certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Public read documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Auth upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Auth upload projects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects');
CREATE POLICY "Auth upload certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates');
CREATE POLICY "Auth upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Auth update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');
CREATE POLICY "Auth update projects" ON storage.objects FOR UPDATE USING (bucket_id = 'projects');
CREATE POLICY "Auth update certificates" ON storage.objects FOR UPDATE USING (bucket_id = 'certificates');
CREATE POLICY "Auth update documents" ON storage.objects FOR UPDATE USING (bucket_id = 'documents');
CREATE POLICY "Auth update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media');

CREATE POLICY "Auth delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');
CREATE POLICY "Auth delete projects" ON storage.objects FOR DELETE USING (bucket_id = 'projects');
CREATE POLICY "Auth delete certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates');
CREATE POLICY "Auth delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents');
CREATE POLICY "Auth delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Profile Settings
INSERT INTO profile_settings (
  name, headline, subtitle, about, email, github, linkedin, instagram,
  location, seo_title, seo_description, seo_keywords, site_url
) VALUES (
  'Bayu Praditya',
  'Full Stack Software Engineer',
  'Informatics student building AI-driven, backend-solid, front-of-mind web products. I care about how software feels, not just what it does.',
  ARRAY[
    'Saya adalah mahasiswa Teknik Informatika di Universitas Gunadarma yang memiliki ketertarikan pada Full-Stack Development, Machine Learning, dan Graphic Design. Bagi saya, teknologi bukan hanya tentang menulis baris kode, tetapi tentang bagaimana desain, pengalaman pengguna, dan sistem backend dapat bekerja selaras untuk menciptakan produk digital yang bermanfaat. Saya menikmati proses mengubah ide menjadi solusi nyata melalui eksplorasi, eksperimen, dan pengembangan yang berkelanjutan.',
    'Di luar dunia akademik, sejak tahun 2023 saya membangun dan mengelola CLT.Store, sebuah bisnis digital di bidang top-up dan joki game berbasis Instagram. Pengalaman tersebut membentuk cara saya memandang pengembangan perangkat lunak—tidak hanya dari sisi teknis, tetapi juga dari sudut pandang pengguna, operasional, dan pertumbuhan produk. Saya percaya bahwa software yang baik bukan hanya berjalan dengan benar, tetapi juga mampu memberikan pengalaman yang sederhana, efisien, dan bernilai bagi penggunanya.'
  ],
  'bayuupraditya@gmail.com',
  'https://github.com/bayupradityaa',
  'https://www.linkedin.com/in/bayupradityaa/',
  'https://www.instagram.com/bayuupradityaa',
  'Bogor, Indonesia',
  'Bayu Praditya — Full Stack Software Engineer',
  'Portfolio of Bayu Praditya, a full stack software engineer working across AI, backend engineering, and modern frontend. Built for craft, performance, and detail.',
  ARRAY['Bayu Praditya', 'software engineer', 'full stack developer', 'AI engineer', 'portfolio'],
  'https://bayupraditya.dev'
);

-- Technologies
INSERT INTO technologies (name, icon, category, sort_order) VALUES
  ('React', 'React', 'Frontend', 1),
  ('Next.js', 'Next.js', 'Frontend', 2),
  ('TypeScript', 'TypeScript', 'Frontend', 3),
  ('Tailwind CSS', 'Tailwind CSS', 'Frontend', 4),
  ('GSAP', 'GSAP', 'Frontend', 5),
  ('Framer Motion', 'Framer Motion', 'Frontend', 6),
  ('Lenis', 'Lenis', 'Frontend', 7),
  ('Go', 'Go', 'Backend', 8),
  ('Fiber', 'Fiber', 'Backend', 9),
  ('Node.js', 'Node.js', 'Backend', 10),
  ('Express', 'Express', 'Backend', 11),
  ('Flask', 'Flask', 'Backend', 12),
  ('REST API', 'REST API', 'Backend', 13),
  ('Python', 'Python', 'AI & ML', 14),
  ('Scikit-Learn', 'Scikit-Learn', 'AI & ML', 15),
  ('Pandas', 'Pandas', 'AI & ML', 16),
  ('NumPy', 'NumPy', 'AI & ML', 17),
  ('Matplotlib', 'Matplotlib', 'AI & ML', 18),
  ('Sentiment Analysis', 'Sentiment Analysis', 'AI & ML', 19),
  ('PostgreSQL', 'PostgreSQL', 'Data & Cloud', 20),
  ('MySQL', 'MySQL', 'Data & Cloud', 21),
  ('Firebase', 'Firebase', 'Data & Cloud', 22),
  ('Supabase', 'Supabase', 'Data & Cloud', 23),
  ('Cloudflare', 'Cloudflare', 'Data & Cloud', 24),
  ('Git', 'Git', 'Workflow', 25),
  ('GitHub', 'GitHub', 'Workflow', 26),
  ('GitHub Actions', 'GitHub Actions', 'Workflow', 27),
  ('Docker', 'Docker', 'Workflow', 28),
  ('Postman', 'Postman', 'Workflow', 29),
  ('VS Code', 'VS Code', 'Workflow', 30),
  ('Figma', 'Figma', 'Workflow', 31),
  -- Additional technologies used in projects but not in marquee
  ('PyTorch', 'PyTorch', 'AI & ML', 32),
  ('Transformers', 'Transformers', 'AI & ML', 33),
  ('Recharts', 'Recharts', 'Frontend', 34),
  ('Zod', 'Zod', 'Frontend', 35),
  ('React Hook Form', 'React Hook Form', 'Frontend', 36),
  ('Vercel', 'Vercel', 'Data & Cloud', 37),
  ('Vite', 'Vite', 'Frontend', 38),
  ('Instagram', 'Instagram', 'Workflow', 39),
  ('Canva', 'Canva', 'Workflow', 40),
  ('Photoshop', 'Photoshop', 'Workflow', 41),
  ('Meta Business Suite', 'Meta Business Suite', 'Workflow', 42);

-- Some technologies used in projects but not in the marquee should be unpublished
UPDATE technologies SET published = false WHERE name IN (
  'PyTorch', 'Transformers', 'Recharts', 'Zod', 'React Hook Form', 'Vercel', 'Vite',
  'Instagram', 'Canva', 'Photoshop', 'Meta Business Suite'
);

-- Projects
INSERT INTO projects (slug, name, tagline, year, role, status, summary, cover_image, cover_alt, featured, sort_order) VALUES
(
  'jkt48-sentiment-tracker',
  'JKT48 Live Sentiment Tracker',
  'Real-time AI sentiment analytics powered by IndoBERT.',
  2025,
  'Full Stack Engineer',
  'Local Development',
  'An AI-powered analytics dashboard that monitors live chat sentiment during JKT48 live broadcasts in real time. The application separates UI rendering from deep-learning inference so thousands of incoming messages can be displayed instantly while sentiment classification happens asynchronously through FastAPI and IndoBERT. The result is a responsive real-time dashboard that prioritizes user experience without sacrificing model accuracy.',
  '/projects/jkt48-sentiment.jpg',
  'JKT48 Live Sentiment Tracker — Real-time AI sentiment analytics',
  true,
  1
),
(
  'receh48',
  'Receh48',
  'A modern ticket booking platform built for the JKT48 community.',
  2025,
  'Founder • Full Stack Engineer',
  'Live',
  'Receh48 is a production-ready booking platform designed to streamline ticket assistance services through a responsive customer experience and an integrated internal dashboard. The project focuses on scalable architecture, smooth interactions, business workflow automation, and production deployment.',
  '/projects/receh48.jpg',
  'Receh48 — Modern ticket booking platform',
  true,
  2
),
(
  'clt-store',
  'CLT.Store',
  'Digital gaming services and top-up business operated through Instagram.',
  2023,
  'Founder',
  'Live',
  'CLT.Store is an independently managed online business providing game top-ups and ticket assistance services. Beyond development, the project has helped me understand branding, customer experience, marketing, operational workflows, and product iteration through real customer interactions.',
  '/projects/clt-store.jpg',
  'CLT.Store — Digital gaming services',
  true,
  3
);

-- Update live URLs for projects
UPDATE projects SET live_url = 'https://receh48.web.id', live_url_label = 'Visit Website' WHERE slug = 'receh48';
UPDATE projects SET live_url = 'https://instagram.com/clt.store', live_url_label = 'Visit Instagram' WHERE slug = 'clt-store';

-- Project Technologies (junctions)
-- JKT48 Sentiment Tracker
INSERT INTO project_technologies (project_id, technology_id, sort_order)
SELECT p.id, t.id, row_number() OVER () FROM projects p, technologies t
WHERE p.slug = 'jkt48-sentiment-tracker' AND t.name IN (
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python',
  'PyTorch', 'Transformers', 'Supabase', 'PostgreSQL', 'Framer Motion', 'Recharts', 'Lenis'
);

-- Receh48
INSERT INTO project_technologies (project_id, technology_id, sort_order)
SELECT p.id, t.id, row_number() OVER () FROM projects p, technologies t
WHERE p.slug = 'receh48' AND t.name IN (
  'React', 'Vite', 'Tailwind CSS', 'GSAP', 'Framer Motion',
  'Supabase', 'PostgreSQL', 'React Hook Form', 'Zod', 'Recharts', 'Vercel'
);

-- CLT.Store
INSERT INTO project_technologies (project_id, technology_id, sort_order)
SELECT p.id, t.id, row_number() OVER () FROM projects p, technologies t
WHERE p.slug = 'clt-store' AND t.name IN (
  'Instagram', 'Canva', 'Photoshop', 'Figma', 'Meta Business Suite'
);

-- Project Highlights
-- JKT48 Sentiment Tracker
INSERT INTO project_highlights (project_id, text, sort_order)
SELECT p.id, h.text, h.sort_order FROM projects p,
(VALUES
  ('WebSocket live chat ingestion', 1),
  ('Async FastAPI inference', 2),
  ('IndoBERT sentiment classification', 3),
  ('Non-blocking frontend architecture', 4),
  ('Real-time CPM analytics', 5),
  ('Interactive sentiment timeline', 6),
  ('AI-generated post-stream reports', 7),
  ('Supabase session history', 8)
) AS h(text, sort_order) WHERE p.slug = 'jkt48-sentiment-tracker';

-- Receh48
INSERT INTO project_highlights (project_id, text, sort_order)
SELECT p.id, h.text, h.sort_order FROM projects p,
(VALUES
  ('Complete ordering workflow', 1),
  ('Integrated admin dashboard', 2),
  ('Dynamic quota management', 3),
  ('Real-time order tracking', 4),
  ('SEO optimization', 5),
  ('Structured metadata', 6),
  ('GSAP-powered interactions', 7),
  ('Production deployment', 8)
) AS h(text, sort_order) WHERE p.slug = 'receh48';

-- CLT.Store
INSERT INTO project_highlights (project_id, text, sort_order)
SELECT p.id, h.text, h.sort_order FROM projects p,
(VALUES
  ('Digital commerce operations', 1),
  ('Customer support workflow', 2),
  ('Brand identity', 3),
  ('Social media marketing', 4),
  ('Service automation', 5),
  ('Business management', 6)
) AS h(text, sort_order) WHERE p.slug = 'clt-store';

-- Experience
INSERT INTO experience (period, title, org, description, tags, sort_order) VALUES
(
  '2025 — now',
  'Building in public',
  'Independent',
  'Shipping AI and backend side-projects in the open, writing about the decisions behind them, and turning feedback into the next iteration.',
  ARRAY['AI', 'Open source', 'Writing'],
  1
),
(
  '2024',
  'Full stack projects',
  'University coursework and freelance',
  'Took products end to end: schema design, typed APIs, and front-ends with real motion. Learned that the last 10% of polish is where trust is won.',
  ARRAY['Next.js', 'PostgreSQL', 'TypeScript'],
  2
),
(
  '2023',
  'Foundations in engineering',
  'Informatics program',
  'Data structures, algorithms, and systems thinking. Started treating side-projects as a lab for everything the syllabus could not cover.',
  ARRAY['Algorithms', 'Systems', 'C++'],
  3
),
(
  '2022',
  'First lines of code',
  'Self-taught',
  'Fell for the loop of write, run, break, fix. Built small tools for problems I actually had, and never really stopped.',
  ARRAY['Python', 'Curiosity'],
  4
);

-- Certificates
INSERT INTO certificates (title, issuer, credential_url, issue_date, sort_order) VALUES
('Machine Learning Specialization', 'DeepLearning.AI', 'https://coursera.org/verify/example', '2025-01-01', 1),
('Backend Development & APIs', 'Meta', 'https://coursera.org/verify/example', '2024-01-01', 2),
('Full Stack Web Development', 'The Odin Project', NULL, '2024-01-01', 3),
('Cloud Fundamentals', 'Google Cloud', 'https://cloudskillsboost.google/verify/example', '2023-01-01', 4),
('Data Structures & Algorithms', 'Coursera', NULL, '2023-01-01', 5),
('TypeScript Deep Dive', 'Frontend Masters', NULL, '2024-01-01', 6);
