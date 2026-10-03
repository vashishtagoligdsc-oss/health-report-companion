<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep report PDFs and extracted text ephemeral in the demo session; the unauthenticated preview must not persist sensitive health information or expose it through shared data tables.
- Put report extraction and question answering in server functions so PDF parsing and gateway credentials stay outside the browser bundle.
