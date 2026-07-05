# Scrub Command

Use this command to clean up formatting artifacts (invisible Unicode characters, em-dash overuse) from markdown content files for readability and consistency with house style.

## Usage
`/scrub [file path]`

## What This Command Does
1. Removes invisible Unicode formatting artifacts that generation/editing tools sometimes introduce (zero-width spaces, byte-order marks, etc.)
2. Replaces em-dashes with contextually appropriate punctuation, per house style
3. Cleans up whitespace and formatting artifacts
4. Provides statistics on changes made

## Why This Matters

Invisible Unicode characters (zero-width spaces, byte order marks, zero-width non-joiners, word joiners, soft hyphens) sometimes get introduced during content generation or copy/paste and serve no purpose in published content: they can cause subtle rendering or search-indexing issues. Em-dash de-emphasis is a house style preference, not every publication uses them heavily.

**This command is a formatting/readability pass only. It is not a device for concealing how content was produced, and must never be described or used as one.** All AI-assisted content on Empire sites is subject to the disclosure and editorial-review requirements in EMPIRE_BUILD_STANDARDS.md §6.8. Running `/scrub` does not satisfy those requirements and does not change whether a piece needs an AI-disclosure statement.

## Process

### 1. Invisible Character Removal

The scrubber identifies and removes several types of invisible Unicode characters:

#### Invisible Characters Removed
- **Zero-width spaces** (U+200B): Often inserted between words
- **Byte Order Marks** (U+FEFF): BOM characters that shouldn't appear in content
- **Zero-width non-joiners** (U+200C): Invisible formatting characters
- **Word joiners** (U+2060): Non-breaking invisible characters
- **Soft hyphens** (U+00AD): Optional hyphenation points
- **Narrow no-break spaces** (U+202F): Special spacing characters
- **All format-control characters**: Unicode category Cf characters

### 2. Em-Dash Replacement

The scrubber replaces em-dashes (—) based on context, per house style:

#### Contextual Rules
- **Attribution**: Replaces with comma when used for quotes or attribution
  - Example: "Text — Author Name" becomes "Text, Author Name"
- **Independent Clauses**: Replaces with semicolon when joining complete thoughts
  - Example: "First clause — second clause" becomes "First clause; second clause"
- **Strong Breaks**: Replaces with period when separating distinct sentences
  - Example: "Sentence one — Sentence two" becomes "Sentence one. Sentence two"
- **Simple Separation**: Replaces with comma for list items or simple separation
  - Example: "Item — detail" becomes "Item, detail"
- **Conjunctive Adverbs**: Replaces with semicolon before words like "however", "therefore", "moreover"
  - Example: "Text — however, more text" becomes "Text; however, more text"

### 3. Whitespace Normalization

- **Multiple Spaces**: Reduces multiple consecutive spaces to single space
- **Punctuation Spacing**: Removes spaces before punctuation marks
- **Post-Punctuation Spacing**: Ensures single space after punctuation
- **Excessive Line Breaks**: Reduces 3+ consecutive line breaks to 2

## Output

The command displays:

### Statistics Report
```
Content Scrubbing Complete:
  - Unicode formatting artifacts removed: [count]
  - Format-control chars removed: [count]
  - Em-dashes replaced: [count]
```

### File Update
- Original file is overwritten with cleaned content
- All changes are applied in-place
- Original formatting and structure preserved (except cleaned elements)

## Integration with Writing Workflow

This command runs automatically after content generation:

### Automatic Execution
After `/write` or `/rewrite` commands save article files, the scrubber should run automatically on the main article file, as a formatting/readability pass. This happens **before**, and independently of, the AI-disclosure decision required by EMPIRE_BUILD_STANDARDS.md §6.8 — running `/scrub` does not remove the need to add a disclosure statement where one is required.

## Technical Details

### Implementation
- **Module**: `data_sources/modules/content_scrubber.py`
- **Main Function**: `scrub_file(file_path, output_path, verbose)`
- **Class**: `ContentScrubber` with specialized methods for each cleaning operation

### Idempotency
The scrubber is idempotent, running it multiple times on already-cleaned content produces no additional changes.

### Safety
The scrubbing process:
- Never modifies visible content or meaning
- Only removes invisible/formatting-artifact characters
- Preserves all markdown formatting
- Maintains document structure

## Example Usage

### Basic Scrubbing
```
/scrub drafts/content-marketing-strategies-2025-10-31.md
```

### What Gets Changed

**Before:**
```
Content​ marketing​ is​ a​ powerful​ strategy—businesses can reach global audiences—and convert more customers.
```
(Contains zero-width spaces after words and em-dashes)

**After:**
```
Content marketing is a powerful strategy; businesses can reach global audiences, and convert more customers.
```
(Clean text with house-style punctuation)

## Quality Standards

Every scrubbed file ensures:
- Zero invisible Unicode formatting artifacts
- House-style punctuation
- Clean whitespace formatting
- Publish-ready formatting

## Best Practices

1. Run as a formatting pass before publishing, alongside (not instead of) the AI-disclosure and editorial-review requirements in EMPIRE_BUILD_STANDARDS.md §6.8
2. Run on all generated content as a readability step
3. Check statistics to understand what was cleaned
4. Test on sample content if unsure
5. Include in workflows as a formatting step, not a compliance step

This ensures published content is clean and consistently formatted. **It does not, and must not, substitute for the AI-content-disclosure or editorial-review requirements in EMPIRE_BUILD_STANDARDS.md §6.8.**
