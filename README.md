# Jesus Family Church Website

Free stack: **Supabase** (database, admin login, photo/video storage) + **Vercel** (hosting and a free `yourname.vercel.app` domain).

## 1. Create the database (5 min)
1. Sign up at https://supabase.com and click **New project** (free plan). Save the database password.
2. Open **SQL Editor > New query**, paste everything from `supabase-setup.sql`, click **Run**.
3. Open **Authentication > Users > Add user > Create new user**. Enter YOUR email and a strong password. This is your admin login.
4. Open **Authentication > Sign In / Providers** and turn OFF "Allow new users to sign up", so nobody else can become admin.
5. Open **Project Settings > API**. Copy the **Project URL** and the **anon public** key into `config.js`.

## 2. Put the site online with Vercel (5 min)
1. Create a free GitHub account, make a new repository, and upload all files in this folder.
2. Sign up at https://vercel.com with GitHub, click **Add New > Project**, pick the repository, click **Deploy** (no settings needed).
3. Vercel gives you a free address like `jesus-family.vercel.app`. You can rename it under **Settings > Domains**.

## 3. Run the site (no code)
Open your site, tap **🔒 Admin** (bottom right), log in, then edit any text, upload the founder photo, post sermons, add events, and upload gallery pictures and videos straight from your phone. Prayer requests and recorded gifts appear in Admin on the Prayer and Give pages.

## Notes
- The free Supabase plan allows files up to 50 MB and 1 GB of storage in total. For long sermon videos, paste a YouTube link instead.
- The Give page shows your Mobile Money or bank details and records gifts. It does not take payments itself. Online checkout would need a provider such as Paystack.
- Never put your Supabase `service_role` key in this site. Only the `anon` key belongs in `config.js`.
