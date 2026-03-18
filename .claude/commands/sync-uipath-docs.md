---
description: Fetch latest UiPath docs and/or a Confluence page to update project context
argument-hint: [confluence-url-or-topic]
allowed-tools: WebFetch, Write, Read, mcp__claude_ai_Atlassian__getConfluencePage, mcp__claude_ai_Atlassian__searchConfluenceUsingCql, mcp__claude_ai_Atlassian__fetch
---

# Sync UiPath Documentation Context

Fetch the latest UiPath documentation and/or Confluence page to update the project's understanding.

**Argument**: `$ARGUMENTS`
- If a Confluence URL is provided, fetch that page
- If a UiPath topic/keyword is provided, fetch relevant UiPath docs for that topic
- If no argument, fetch the core UiPath Agents and Agentic Process docs

## Instructions

1. **Determine what to fetch:**
   - If `$ARGUMENTS` contains `atlassian.net` or `confluence` → fetch as Confluence page
   - If `$ARGUMENTS` is a UiPath docs URL → fetch directly
   - If `$ARGUMENTS` is a keyword/topic → map to relevant UiPath docs URL and fetch
   - If empty → fetch the default UiPath agent docs listed below

2. **Default docs to fetch when no argument is given:**
   Fetch ALL of the following and summarize key information from each:
   - `https://docs.uipath.com/orchestrator/automation-cloud/latest/user-guide/about-agents`
   - `https://docs.uipath.com/agent-builder/automation-cloud/latest/user-guide/about-agent-builder`

3. **For Confluence URLs:**
   - Use `WebFetch` to retrieve the page content
   - Extract: page title, key concepts, decisions, requirements, architecture notes
   - Ask the user: "Should I save this to memory for future sessions?"
   - If yes, save to `/Users/prabhatkumar/.claude/projects/-Users-prabhatkumar-Code-Agent/memory/` as a `project` memory

4. **For UiPath docs:**
   - Use `WebFetch` to retrieve the documentation
   - Extract: feature description, key concepts, API surface, limitations
   - Update the skill reference file at `.claude/skills/uipath-context/references/fetched-docs.md` with:
     - Fetch date
     - Source URL
     - Key concepts extracted

5. **Output a summary** of what was fetched and the key takeaways relevant to this Agent Builder project.

6. **Identify any gaps** between what UiPath docs say and what's currently built in the agent-builder codebase.
