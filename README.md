# Github Copilot Custom instructions

## Tutorials
1. 🤖 Awesome GitHub Copilot : https://github.com/github/awesome-copilot/blob/main/README.md
2. Use custom instructions : https://code.visualstudio.com/docs/copilot/customization/custom-instructions
3. Adding repository custom instructions for GitHub Copilot : https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions

## ⚡ .github files

This is where it gets interesting (for your use case):

You now have:
| File                       | Purpose            |
| -------------------------- | ------------------ |
| `copilot-instructions.md`  | AI behavior        |
| `pull_request_template.md` | Human PR structure |
| `workflows/*.yml`          | Automation         |

+ copilot-instructions.md → AI brain
+ pull_request_template.md → developer checklist
+ workflows.yml → automation engine