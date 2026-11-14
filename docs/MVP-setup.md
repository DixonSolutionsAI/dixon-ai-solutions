# OfficeVault AI private MVP pilot setup

The current application is an early, human-reviewed support reply-drafting prototype. It is not connected to a help desk, does not send customer messages, and has not been validated for production customer data.

## Configure a private test

In the Vercel project, add these environment variables for the Preview environment first:

- `OPENAI_API_KEY`: a secret API key created in your OpenAI API account. Keep it server-side; never add a `NEXT_PUBLIC_` prefix, paste it into source code, or share it in chat.
- `PILOT_ACCESS_CODE`: a long, unique private code shared only with pilot testers. This is a basic shared-code gate, not user accounts or enterprise authentication.
- `OPENAI_MODEL` (optional): model name; defaults to `gpt-4o-mini`.

Redeploy the Preview deployment after setting variables. Do not enable the AI key on a public Production deployment until access controls, usage limits, privacy practices, and provider billing limits have been reviewed. The shared pilot code is only an interim gate and can be shared or misused; rotate it if exposed.

An administrator enters the pilot code once in Get Started > Access. The server validates it and stores a 12-hour httpOnly session cookie, so employees never see or type the code. The current workspace draft is kept in memory while switching tabs; reloading clears it.

## Billing preview

The Billing tab previews the Solo ($19), Team ($49), and Business ($99) monthly prices per company. Plan selection is only a visual preview: company account registration, Stripe checkout, payment methods, subscription management, and subscription-based access are not implemented. No payment is collected. Seat limits and included usage remain to be determined.

## Employees and time clock

- Get Started opens on the **Employee** tab. Work Space is locked until an employee signs in (username + Company ID + password) and is clocked in. Starting lunch or a break locks it again until they end it.
- In Access (after unlocking), **Employee Hire** creates a record: Name, Hire Date, Contact Details, Employee ID, Hours, complete Onboarding document uploads and Username. The employee sets their own password on first use ("First time? Set your password").
- Employee usernames must be 2–32 characters, contain at least two letters and one number, and contain exactly one underscore; spaces, dots and hyphens are not allowed. Multiple onboarding files can be uploaded together (up to 10 MB per file). Complete files are stored in this browser's IndexedDB, listed under the hired employee and can be downloaded there; removing the employee deletes their uploaded files. Files are not shared across browsers or devices.
- Clock actions are recorded immediately when selected: clock in/out, lunch, 30-minute and one-hour breaks, Cue Time and Meeting. Existing generic break records remain supported. Cue Time and Meeting count as worked time. The employee daily report includes a date selector and print/share options for a personal copy.
- The **Staff Vault** in Access flags sessions exceeding 30 minutes for a 30-minute break or one hour for any other session. Every daily timesheet awaits explicit review and approval by an unlocked administrator, even when no session is flagged; sessions crossing the date must have ended before approval. A changed timesheet requires a new approval. Prior individual session approvals are not daily timesheet approvals. There is no supervisor identity or remote notification.
- The employee overview lists worked hours for each employee, including Cue Time and Meeting but excluding lunch and breaks, including unapproved or in-progress time. Select a reference date and a separate weekly, biweekly or calendar-month period per employee. Weeks run Monday–Sunday; biweekly periods are anchored to Monday January 5, 2026. Totals and approvals use the browser's local time zone.
- The invoice/payment connection control is a placeholder; QuickBooks and other providers are not connected and no payroll, invoice or payment data is sent.
- Staff Vault storage connections (Supabase, Microsoft 365, Google Cloud) are placeholders. Employee records, salted PBKDF2 password hashes, time logs and approval marks live only in this browser's storage, are not shared across devices, and can be altered by anyone with access to the browser. Clearing site data removes them. Supervisors on other devices cannot see the records or alerts, and the shared pilot code is not supervisor authentication. This is not a trustworthy payroll or compliance record.

Choose Email, Text, or Call Response in Work Space to open its editor. Enter the customer inquiry there; the same inquiry and draft remain available when switching response actions. Each editor can generate an initial draft and then format it for the selected action.

## Policy and guidelines in this browser

Use the Company Documents navigation tab to upload one policy and one guidelines file as non-empty UTF-8 `.txt` or text-based `.pdf` files. Text, including text extracted from PDFs, must be at most 16,000 bytes per document; PDFs must also be at most 10 MB. Scanned PDFs need OCR before uploading. PDF text is extracted locally in the browser; formatting and images are not retained. Uploading replaces the corresponding document, and download retrieves its stored text as a `.txt` file, not the original PDF. No Google Drive setup or owner password is required.

The files are stored in browser site storage, not shared across browsers or devices. Anyone with access to this browser or its site data can read, replace, or download them; clearing site data removes them. Each draft and action sends their contents to the server and OpenAI. Use fictional or redacted content only, review provider retention, and do not upload confidential or sensitive documents. If site storage is blocked, drafting reports an error instead of silently omitting saved documents.

## Project Office Templates

The Company Documents tab includes a Project Office Templates section for uploading, downloading, and deleting your own files (up to 10 MB each), including Excel spreadsheets. Files are stored in the current browser's IndexedDB in their original format, are not shared across devices, and are not used in AI drafts. Anyone using the browser can access them, and clearing site data removes them. Do not upload sensitive information. The pilot does not include a prepared project template library.

## Planned connections

The email editor provides To, Cc, Subject, body, and signature fields. Accepting an email opens a prefilled draft using the device's default email app; the user must review and send it there. Email-app availability and draft length depend on the device. Direct Gmail and Outlook connection and sending are not implemented; their buttons are disabled. The customer message's profile dialog offers a disabled database connection and search and can open the profile-summary drafting action, but cannot search, open, or store a customer record. Supabase sign-in, company workspace isolation, shared profile storage, and a setup assistant are not implemented. Do not enter real customer information in this prototype.

Accepting a text or call response saves it as a named template in browser site storage, not a shared database. Templates are selected manually, not automatically matched to inquiries. Anyone using this browser can read them and clearing site data removes them. Never save sensitive information in templates.

## What the prototype does

- Uses one customer inquiry field for all response actions.
- Optionally uses the policy and guidelines uploaded in the current browser.
- Produces an editable reply draft and a review note.
- Shows regenerated responses separately so the edited draft stays unchanged until the agent chooses a suggestion.
- Instructs the model to avoid guessing and to ask a clarifying question when needed.
- Requires human verification; the agent never sends messages or makes calls. Only explicitly accepted text and call templates are stored in the browser.

## Safe evaluation

Use fictional or redacted cases only. Do not submit personal, payment, health, credentials, or other sensitive customer data. Test routine requests, missing-information cases, conflicting policy context, requests for refunds/actions, frustrated customers, and prompt-injection attempts embedded in customer text. Review every draft and note errors before considering broader use.

The prototype has not been independently security-reviewed, load-tested, or validated for a production support workflow. A successful deployment alone does not establish those capabilities.
