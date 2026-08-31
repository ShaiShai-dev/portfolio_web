# Supabase recovery email

For the hosted Supabase project:

1. Open **Authentication → URL Configuration**.
2. Set **Site URL** to the deployed portfolio URL.
3. Add `http://localhost:3000/**` for local development and the production
   `https://your-domain.example/**` URL to **Redirect URLs**.
4. Open **Authentication → Email Templates → Reset password**.
5. Set the subject to `Reset your SHAI admin password`.
6. Copy the full contents of `recovery.html` into the template body and save.

The button uses `RedirectTo`, `TokenHash`, and the `recovery` verification type.
The application supplies `/auth/confirm?next=/auth/update-password` as the
redirect destination and verifies the token server-side before opening the new
password form.

For production delivery, enable a custom SMTP provider in **Authentication
settings** and set the sender name/address there. If that provider has click or
link tracking, disable it for authentication email because rewritten recovery
links can fail verification.
