# Roadmap Automation Setup Guide

This guide explains how to set up the automated roadmap management workflow that updates project todos based on due dates.

## What it does

The workflow automatically:
1. **Marks overdue todos as "Delayed"** - Items past their due date (except "Done" items) get moved to "Delayed" status
2. **Extends in-progress item due dates** - Items marked as "In Progress" that are overdue get their due date extended to the current date
3. **Runs daily** - Executes every day at 9 AM UTC to keep your roadmap current

## Setup Requirements

### 1. Personal Access Token (Classic)
Create a classic Personal Access Token with the following permissions:
- `repo` (full repository access)
- `read:org` (read organization data)
- `project` (read/write project data)

**Important**: Fine-grained tokens don't work with GraphQL API yet, so you must use a classic PAT.

### 2. Repository Secrets
Add the following secret to your repository:
- `ROADMAP_PAT`: Your personal access token from step 1

### 3. Repository Variables
Add the following variable to your repository:
- `PROJECT_NUMBER`: The number of your GitHub project (found in the project URL)

### 4. Project Structure Requirements
Your GitHub project must have these fields:
- **Status**: Single-select field with options including "Delayed", "In Progress", and "Done"
- **Due Date**: Date field for tracking deadlines

## How to Configure

### Step 1: Get Project Number
1. Go to your GitHub project
2. Look at the URL: `https://github.com/orgs/YOUR-ORG/projects/123`
3. The number at the end (123) is your project number

### Step 2: Create Personal Access Token
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select the required scopes listed above
4. Copy the generated token

### Step 3: Add Repository Secrets and Variables
1. Go to your repository Settings → Secrets and variables → Actions
2. Add `ROADMAP_PAT` as a secret with your token value
3. Add `PROJECT_NUMBER` as a variable with your project number

### Step 4: Customize Field Names (if needed)
If your project uses different field names, edit the workflow file:
- Change `"Status"` to your status field name
- Change `"Due Date"` to your due date field name
- Update status option names like `"Delayed"`, `"In Progress"`, `"Done"`

## Manual Execution

You can trigger the workflow manually:
1. Go to Actions tab in your repository
2. Select "Roadmap Automation" workflow
3. Click "Run workflow"

## Troubleshooting

### Common Issues
1. **Permission denied**: Ensure your PAT has the correct scopes
2. **Project not found**: Verify the project number is correct
3. **Field not found**: Check that field names match exactly (case-sensitive)

### Logs
Check the workflow logs in the Actions tab for detailed error messages and execution details.

## Security Notes
- The PAT is stored as a repository secret and never exposed in logs
- The workflow only reads project data and updates status/due date fields
- No sensitive data is processed or stored