#!/bin/bash

# Setup Labels Script for project-etna
# This script creates all project labels using GitHub CLI
# Prerequisites: GitHub CLI (gh) installed and authenticated

set -e

REPO="gagan-malik/project-etna"

echo "🏷️  Setting up labels for $REPO..."
echo ""

# Function to create or update a label
create_label() {
    local name="$1"
    local color="$2"
    local description="$3"
    
    # Try to create the label, if it exists, update it
    if gh label create "$name" --color "$color" --description "$description" --repo "$REPO" 2>/dev/null; then
        echo "✅ Created: $name"
    else
        gh label edit "$name" --color "$color" --description "$description" --repo "$REPO" 2>/dev/null && \
        echo "📝 Updated: $name" || \
        echo "⚠️  Failed: $name"
    fi
}

echo "📦 Issue Types"
echo "─────────────────────────────"
create_label "bug" "d73a4a" "Something isn't working"
create_label "enhancement" "a2eeef" "New feature or request"
create_label "documentation" "0075ca" "Improvements or additions to documentation"
create_label "question" "d876e3" "Further information is requested"
create_label "security" "ee0701" "Security-related issue"

echo ""
echo "🎯 Priority Labels"
echo "─────────────────────────────"
create_label "priority/critical" "b60205" "Critical priority - requires immediate attention"
create_label "priority/high" "d93f0b" "High priority"
create_label "priority/medium" "fbca04" "Medium priority"
create_label "priority/low" "0e8a16" "Low priority"

echo ""
echo "📊 Status Labels"
echo "─────────────────────────────"
create_label "needs-triage" "ededed" "Needs initial review and categorization"
create_label "confirmed" "215cea" "Issue has been confirmed/reproduced"
create_label "in-progress" "fef2c0" "Currently being worked on"
create_label "blocked" "b60205" "Blocked by another issue or external dependency"
create_label "needs-info" "ffffff" "Additional information needed from reporter"
create_label "wontfix" "ffffff" "This will not be worked on"
create_label "duplicate" "cfd3d7" "This issue or pull request already exists"
create_label "invalid" "e4e669" "This doesn't seem right"
create_label "stale" "9e9e9e" "No recent activity"
create_label "keep-open" "0e8a16" "Should not be closed by stale bot"

echo ""
echo "🧩 Component Labels"
echo "─────────────────────────────"
create_label "component/ui" "5319e7" "Related to the user interface"
create_label "component/api" "5319e7" "Related to API routes and endpoints"
create_label "component/auth" "5319e7" "Related to authentication and authorization"
create_label "component/database" "5319e7" "Related to database and data layer"
create_label "component/ai" "5319e7" "Related to AI/LLM functionality"
create_label "component/integrations" "5319e7" "Related to third-party integrations"

echo ""
echo "⏱️  Effort Labels"
echo "─────────────────────────────"
create_label "effort/small" "c5def5" "Estimated effort: less than 1 day"
create_label "effort/medium" "c5def5" "Estimated effort: 1-3 days"
create_label "effort/large" "c5def5" "Estimated effort: more than 3 days"

echo ""
echo "📏 Size Labels (for PRs)"
echo "─────────────────────────────"
create_label "size/XS" "009900" "Extra small change (< 10 lines)"
create_label "size/S" "77bb00" "Small change (< 50 lines)"
create_label "size/M" "eebb00" "Medium change (< 200 lines)"
create_label "size/L" "ee9900" "Large change (< 500 lines)"
create_label "size/XL" "ee5500" "Extra large change (500+ lines)"

echo ""
echo "👥 Contribution Labels"
echo "─────────────────────────────"
create_label "good first issue" "7057ff" "Good for newcomers"
create_label "help wanted" "008672" "Extra attention is needed"

echo ""
echo "🚀 Release Labels"
echo "─────────────────────────────"
create_label "breaking-change" "ee0701" "Introduces a breaking change"
create_label "needs-release-notes" "0e8a16" "Should be mentioned in release notes"

echo ""
echo "🔧 Technical Labels"
echo "─────────────────────────────"
create_label "tech-debt" "ffa500" "Technical debt or refactoring needed"
create_label "performance" "ff69b4" "Performance-related issue or improvement"
create_label "testing" "bfd4f2" "Related to tests or testing infrastructure"

echo ""
echo "✨ Done! All labels have been set up."
echo ""
echo "View your labels at: https://github.com/$REPO/labels"
