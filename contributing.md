# Contributing to Melee Light

:+1::tada: First off, thanks for taking interest in the project! :tada::+1:

The following is a set of guidelines for contributing to Melee Light.
These are guidelines, not rules. Please use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [Code of Conduct](#code-of-conduct) 
  * [Design Decisions](#design-decisions)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)
  * [CoffeeScript Styleguide](#coffeescript-styleguide)
  * [Specs Styleguide](#specs-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)

[Additional Notes](#additional-notes)
  * [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## What should I know before I get started?

### Code of Conduct

This project adheres to the Contributor Covenant [code of conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.
Please report unacceptable behavior to [the dev chat in discord](https://discordapp.com/channels/206436912049815552/251887323476656128).

### Melee Light Overall

Melee light is a fan project entirely built from the ground up in web tech. It was recently open sourced and still has some rough edges (we are very aware of that)
When you initially consider contributing to Melee Light, you might be unsure about where you may be able to help.
This section should help you with that.

 
### Submission Process

## Process - Public Discussion

1. Create a pull request describing the content.
1. Discuss
1. Document arguments for and against
1. Discuss
1. Merge the pull request

When we make a significant decision in how we maintain the project and what we can or cannot support, we will document it here.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Melee Light. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check the issues page [issues](https://github.com/schmooblidon/meleelight/issues) and [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). If you'd like, you can use [this template](#template-for-submitting-bug-reports) to structure the information.

#### Before Submitting A Bug Report

 * **Check the [FAQs](#faq)** for a list of common questions and problems.
 * **Perform a [cursory search](https://github.com/schmooblidon/meleelight/issues)** to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?
 
Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. For example, start by explaining how you started the game, e.g. which browser you are using. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you moved a character and they disappeared, explain which moves were taken, what buttons were pressed, and if the game recovered afterwards.
* **Provide specific examples to demonstrate the steps**. Should you provide code, include links to files or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, please use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps and clearly demonstrate the problem. If you use the keyboard while following the steps, **record the GIF with the [Keybinding Resolver](https://github.com/atom/keybinding-resolver) shown**. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **If you're reporting that the game crashed**, include a crash report with a stack trace from the browser you are using. Developer tools come with almost every browser on the market. Chrome dev tools open with control+shift+I(windows) cmd+option+I (mac). Include the crash report in the issue in a [code block](https://help.github.com/articles/markdown-basics/#multiple-lines), a [file attachment](https://help.github.com/articles/file-attachments-on-issues-and-pull-requests/), or put it in a [gist](https://gist.github.com/) and provide link to that gist.
* **If the problem is related to performance**, include a [CPU profile capture and a screenshot or submit the file](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool) with your report.
* **If the Chrome's developer tools pane is shown without you triggering it**, that normally means that an exception was thrown. The Console tab will include an entry for the exception. Expand the exception so that the stack trace is visible, and provide the full exception and stack trace in a [code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines) and as a screenshot.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.


Include details about your configuration and environment:

* **What's the name and version of the OS you're using**?
* **Are you running the game in a virtual machine or a console?** If so, which VM software are you using and which operating systems and versions are used for the host and the guest? Which console?
* **Which keyboard layout are you using?** Are you using a US layout or some other layout?

#### Template For Submitting Bug Reports

    [Short description of problem here]

    **Reproduction Steps:**

    1. [First Step]
    2. [Second Step]
    3. [Other Steps...]

    **Expected behavior:**

    [Describe expected behavior here]

    **Observed behavior:**

    [Describe observed behavior here]

    **Screenshots and GIFs**

    ![Screenshots and GIFs which follow reproduction steps to demonstrate the problem](url)

     
    **OS and version:** [Enter OS name and version here]

    **Installed packages:**

    [List of installed packages here]

    **Additional information:**

    * Problem can be reproduced in safe mode: [Yes/No]
    * Problem started happening recently, didn't happen in an older version of the game: [Yes/No]
    * Problem can be reliably reproduced, doesn't happen randomly: [Yes/No]
    * Problem happens with all files and projects, not only some files or projects: [Yes/No]

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Melee Light, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion :pencil: and find related suggestions :mag_right:.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). If you'd like, you can use [this template](#template-for-submitting-enhancement-suggestions) to structure the information.

#### Before Submitting An Enhancement Suggestion

* **Refresh the browser you are using.** — you might discover that the enhancement is already available. 
* **Try a download build.** Latest download builds are available from [this link](https://github.com/schmooblidon/meleelight/archive/download.zip), and have the latest features. Unzip, and open index.html with your browser.
* **Perform a [cursory search](https://github.com/schmooblidon/meleelight/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). If you have determined that no issue covers your enhancement suggestion, create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots and animated GIFs** which help you demonstrate the steps or point out what in Melee Light the suggestion is related to. You can use [this tool](http://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* **Explain why this enhancement would be a worthy addition** to most users and is something that can or should be implemented.
* **Show in the original game where this enhancement exists if necessary.**
* **Specify WHEN you last refreshed the game.** You can play the newest stable release at [IKNEEDDATA](http://ikneedata.com/meleelight).
* **Specify the name and version of the OS you're using as well as the name and version of the browser you are using.**

#### Template For Submitting Enhancement Suggestions

    [Short description of suggestion]

    **Steps which explain the enhancement**

    1. [First Step]
    2. [Second Step]
    3. [Other Steps...]

    **Current and suggested behavior**

    [Describe current and suggested behavior here]

    **Why would the enhancement be useful to most users**

    [Explain why the enhancement would be useful to most users]

     
    **Screenshots and GIFs**

    ![Screenshots and GIFs which demonstrate the steps or how the enhancement suggestion is relevant](url)

     
    **OS and Browser Version:** [Enter OS/Browser name and version here]

### Your First Code Contribution

Unsure where to begin contributing to Melee Light? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.
 
 
### Pull Requests

* Include screenshots and animated GIFs in your pull request whenever possible.
* Follow the [Airbnb](https://github.com/airbnb/javascript) and [Flow](https://github.com/ryyppy/flow-guide/tree/master/styleguide) styleguides.
* These rules are applied by ESLint where currently enabled. Should you find yourself updating code that is still not covered, It would be much appreciated if you update the source to conform to these linter rules.
 * Should you wish to go above and beyond these rules please be sure that the build can complete successfully.
 * Document new code  
 * Avoid platform-dependent code:
    * Use `require('fs-plus').getHomeDirectory()` to get the home directory.
    * Use `path.join()` to concatenate filenames.
    * Use `os.tmpdir()` rather than `/tmp` when you need to reference the
      temporary directory.
    
### Documentation Styleguide

* Use [AtomDoc](https://github.com/atom/atomdoc).
* Use [Markdown](https://daringfireball.net/projects/markdown).
  
## FAQ

*Q. Will Online ever be available?
*A. Most likely sometime in the future.

*Q. How many characters will there be?
*A. What's planned right now is Top 8, excluding ICs.

*Q. How can I get my controller to work?
*A. Ask Schmoo or WwwWario on Discord and they will try their best to help you.

*Q. Why doesn't the official adapter work on Chrome?
*A. Because Chrome won't allow direct input. The latest WebVR-enabled experimental versions of Chrome have improved gamepad support, you might want to try those.

*Q. Why does my screen get stuck on the loading screen in the downloaded game?
*A. If you are using an old download, you need to run MeleeLightDebug.html, if it still doesn't load we'll try to help.

*Q. You can go through the walls on Target Test Stages! Do you guys know about this?
*A. Yes. The collision detection is currently being reworked, and will fix these issues.

*Q. Why does my game not load and when it does load certain things makes it crash?
*A. This game is still being developed, all will be fixed along the way.

*Q. How does Melee Light compare to Melee?
*A. The Devs are trying their best to replicate Vanilla Melee.

*Q. Who made this project?
*A. The head Developers are Schmoo, Tatatat0, Bites, BonesMalones, Nehgromancer, shf, and ShortFuse.

*Q. I found a bug, is there a way to report it?
*A. Join the Discord and there's a text channel you can report bugs in. There's also Custom Stage sharing, idea sharing, and much more. It's also a very good way to get in contact with us.

*Q. Why is my controller not supported?
*A. If your browser detects your controller, support for the controller can be added. Check this website http://rawgit.com/backbone-input/gamepad/master/examples/monitor.html to see if your controller is detected. If your controller is detected by this page, but doesn't work in game, contact one of the Devs.  If your controller is not detected by this page, you might have better luck with    another web browser.

*Q. Where can I download the game?
*A. Download from https://github.com/schmooblidon/meleelight/archive/download.zip, unzip and open index.html with your internet browser of choice.
  
  ## Additional notes
  
  If using mayflash adapter, switch to PC mode. You may need to refresh the page or restart your browser
  If using official adapter, install vJoy drivers http://m4sv.com/page/wii-u-gcn-usb-driver 
  and play on Firefox
