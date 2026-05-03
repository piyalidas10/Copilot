## Pull Request Checklist

- [ ] I have read and followed the [CONTRIBUTING.md](https://github.com/github/awesome-copilot/blob/main/CONTRIBUTING.md) guidelines.
- [ ] I have read and followed the [Guidance for submissions involving paid services](https://github.com/github/awesome-copilot/discussions/968).
- [ ] My contribution adds a new instruction, prompt, agent, skill, or workflow file in the correct directory.
- [ ] The file follows the required naming convention.
- [ ] The content is clearly structured and follows the example format.
- [ ] I have tested my instructions, prompt, agent, skill, or workflow with GitHub Copilot.
- [ ] I have run `npm start` and verified that `README.md` is up to date.
- [ ] I am targeting the `staged` branch for this pull request.

---

## 📦 What does this PR do?
<!-- Describe changes clearly -->

---

## 🧠 Type of Change
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Performance Improvement

---

## Type of Contribution

- [ ] New instruction file.
- [ ] New prompt file.
- [ ] New agent file.
- [ ] New plugin.
- [ ] New skill file.
- [ ] New agentic workflow.
- [ ] Update to existing instruction, prompt, agent, plugin, skill, or workflow.
- [ ] Other (please specify):

---

## 🅰️ Angular Checklist (MANDATORY)

### Architecture
- [ ] Follows clean architecture (no business logic in components)
- [ ] Uses proper folder structure (core/shared/features)

### Components
- [ ] Uses ChangeDetectionStrategy.OnPush
- [ ] Component is small & reusable
- [ ] No heavy logic inside component

### State Management
- [ ] Uses Signals where applicable
- [ ] Avoids unnecessary RxJS usage
- [ ] No nested subscriptions

### API & Services
- [ ] API calls only in services
- [ ] Proper error handling implemented
- [ ] Strong typing (no `any`)

### Performance
- [ ] trackBy used in ngFor
- [ ] Lazy loading implemented (if needed)

---

## 🧪 Testing
- [ ] Unit tests added
- [ ] Edge cases covered

---

## 🔐 Security
- [ ] No secrets in code
- [ ] Input sanitized

---

## 📊 AI Score (Auto-generated)
<!-- AI will fill this -->

---

## Additional Notes

<!-- Add any additional information or context for reviewers here. -->

---

By submitting this pull request, I confirm that my contribution abides by the [Code of Conduct](../CODE_OF_CONDUCT.md) and will be licensed under the MIT License.
