# GitHub Discussions Setup Guide

This guide explains how to enable and configure GitHub Discussions for project-etna.

## Enabling Discussions

1. Go to https://github.com/gagan-malik/project-etna/settings
2. Scroll down to the **Features** section
3. Check **Discussions** to enable it
4. Click **Set up discussions** to create the initial categories

## Recommended Categories

Configure these categories for effective community engagement:

### 📣 Announcements (Announcement type)
- **Description:** Official announcements and updates from maintainers
- **Who can post:** Maintainers only
- **Use for:** Release announcements, important updates, deprecation notices

### 💡 Ideas (Open-ended type)
- **Description:** Share and discuss ideas for new features
- **Who can post:** Everyone
- **Use for:** Feature brainstorming, design discussions, feedback gathering

### 🙏 Q&A (Question/Answer type)
- **Description:** Ask questions and get answers from the community
- **Who can post:** Everyone
- **Use for:** Usage questions, troubleshooting, how-to discussions
- **Note:** Answers can be marked as correct

### 🗣️ General (Open-ended type)
- **Description:** General discussions about the project
- **Who can post:** Everyone
- **Use for:** Community chat, introductions, off-topic discussions

### 🙌 Show and Tell (Open-ended type)
- **Description:** Share what you've built with project-etna
- **Who can post:** Everyone
- **Use for:** Showcasing projects, integrations, demos

### 📚 Resources (Open-ended type)
- **Description:** Share helpful resources, tutorials, and guides
- **Who can post:** Everyone
- **Use for:** Blog posts, tutorials, documentation links

## Setting Up Categories

### Via GitHub Web UI

1. Go to https://github.com/gagan-malik/project-etna/discussions
2. Click the gear icon (⚙️) next to "Categories" 
3. Click **"New category"** for each category above
4. Configure:
   - **Category name:** (e.g., "Ideas")
   - **Description:** (from above)
   - **Discussion Format:** (Announcement, Open-ended, or Q&A)
   - **Emoji:** (from above)

## Discussion Templates (Optional)

You can create templates for common discussion types:

### Feature Idea Template

```markdown
## Problem
<!-- What problem does this feature solve? -->

## Proposed Solution
<!-- Describe your idea -->

## Alternatives Considered
<!-- What other approaches did you think about? -->

## Additional Context
<!-- Any other information that might be helpful -->
```

### Show and Tell Template

```markdown
## Project Name
<!-- What did you build? -->

## Description
<!-- Brief description of your project -->

## Tech Stack
<!-- What technologies did you use? -->

## Demo/Links
<!-- Links to demo, repo, or screenshots -->

## Lessons Learned
<!-- What did you learn while building this? -->
```

## Pinned Discussions

Pin important discussions to the top:

1. **Welcome Post** - Introduction to the community
2. **Community Guidelines** - Code of conduct and expectations  
3. **FAQ** - Frequently asked questions
4. **Roadmap** - Project roadmap discussion

### Sample Welcome Post

```markdown
# 👋 Welcome to project-etna Discussions!

We're excited to have you here! This is the place to:

- 💡 Share ideas for new features
- ❓ Ask questions and get help
- 🎉 Show off what you've built
- 💬 Connect with other community members

## Before You Post

1. **Search first** - Your question might already be answered
2. **Use the right category** - It helps others find your discussion
3. **Be respectful** - Follow our Code of Conduct
4. **Report issues separately** - Use GitHub Issues for bugs

## Quick Links

- 📚 [Documentation](README.md)
- 🐛 [Report a Bug](https://github.com/gagan-malik/project-etna/issues/new?template=bug_report.yml)
- ✨ [Request a Feature](https://github.com/gagan-malik/project-etna/issues/new?template=feature_request.yml)

Looking forward to hearing from you! 🚀
```

## Moderation

### Locking Discussions
- Lock resolved Q&A discussions to prevent necro-posting
- Lock heated discussions if they become unproductive

### Converting to Issues
- Use "Convert to issue" for discussions that become actionable work items

### Labels
Discussions also support labels:
- `answered` - For Q&A that has a solution
- `needs-more-info` - When more details are needed
- `feedback-wanted` - When seeking community input

## Integration with Issues

### When to Use Issues vs Discussions

| Use Issues For | Use Discussions For |
|----------------|---------------------|
| Bugs | Questions |
| Feature requests (refined) | Feature ideas (brainstorming) |
| Actionable tasks | General feedback |
| Things that need tracking | Community conversations |

### Converting Between Them

- **Discussion → Issue:** Click "Convert to issue" in the discussion
- **Issue → Discussion:** Close the issue and create a related discussion
