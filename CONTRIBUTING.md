# Contributing

Thanks for helping improve this project! Please follow these steps so contributions are easy to review and merge.

1. Fork the repository and create a feature branch:

```bash
git clone <your-fork-url>
git checkout -b feat/short-descriptive-name
```

2. Development and formatting
- Run a local static server to test changes (Live Server or Python):

```bash
# using Python
python3 -m http.server 8080
```

- Keep markup semantic and styles in `style.css`. Keep JavaScript changes minimal and documented in `script.js` or relevant files.

3. Add content
- Add new guidelines to `data/guidelines.json` and place PDFs into the relevant `pdfs/<AGENCY>/` folder.
- Update agency or country pages under `agencies/` as needed.

4. Commit rules
- Use clear commits: `feat:`, `fix:`, `docs:`, `chore:` prefixes recommended.

5. Pull request
- Open a PR against `main` with a concise description of the change and why it’s needed.
- Include screenshots for visual changes and sample JSON snippets for data changes.

6. Review checklist (for PR authors)
- The site builds and runs locally.
- JSON files are valid (no trailing commas).
- New PDFs are stored under `pdfs/` and referenced with the correct path.
- Update `README.md` if the contribution affects usage or setup.

7. Code of Conduct
Be professional and respectful. If you want a formal Code of Conduct added, open an issue and I will add one.

If you want help creating a PR or need guidance, open an issue describing what you want to change and I’ll assist.