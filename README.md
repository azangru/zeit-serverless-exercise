# Introduction

This is a quick-and-dirty prototype of a help and documentation system for Ensembl, in which the content is stored in plain-text files.

When evaluating it, please keep in mind that it is a very early prototype and that almost anything about it can be changed to make it more usable.

_**Note:** This repository currently contains both the documentation files and the code that transforms them into the format usable by Ensembl client. If this prototype is accepted as the preferred way of maintaining documentation, we will likely split the repository into two, one containing only documentation files, and the other containing the code that consumes and transforms them._

# Types of help/documentation
From Ensembl user's perspective, there are two distinct types of documentation. Here, in this document, they will be referred to as "contextual help" and "standalone documentation".
- Contextual help will be shown in various popups on application screens of the Ensembl site. For example, a popup will appear if you click on the top-right help element on the Species Selector or Genome Browser page
- Standalone documentation will appear on dedicated documentation pages.

For the purposes of this prototype, both types of documentation are written in the same way. If this prototype gets the go-ahead, we may decide to split these types of documentation into separate folders.

# How to author content
The prototype can handle two types of content: articles and videos. All content should be stored as markdown files in the `docs/article` or `docs/video` folder. You can create new markdown files in these folders, or edit the existing ones.

**Note:** In this prototype, the file `docs/article/select-a-species.md` provides contextual help for the Species Selector page, and the file `docs/article/using-the-genome-browser.md` provides contextual help for the Genome Browser page.

# How to integrate images into content
Save image files to the `images` folder, and then add links to them in the body of appropriate markdown files, starting the path from the root of the project.

Example: `![alt text](/images/path/to/file)` (I believe the alt text block can be empty: `![](/images/path/to/file)`).

_(See `docs/article/select-a-species.md` for the reference)_.

# How to integrate videos into content

## Option 1: Add a markdown file with video data
- Add a markdown file in the `docs/video` folder.
- Format it similarly to other files in this folder.
- Add the `related-video` metadata field in the frontmatter of appropriate markdown files (see `docs/article/select-a-species.md` as example).

**Important** Please note that the video appearing on Ensembl website will be embedded in an iframe. Youtube is very particular about its links — urls for videos embedded in iframes should end in `/embed/:id` rather than in `/watch?v=:id`. To get the correct url from youtube, click on `Share`, then `Embed`. What you want, is just the content of the `src` attribute of the code for the iframe.

**Note:** We are currently supporting only one video per article using this approach. This is a limitation that we will be able to overcome if needed.

## Option 2: Simply add iframe html code in the markdown file
This is an example of using an escape hatch when authoring markdown files. If you do not need to associate any metadata with a video, but simply want to add it inside your article, you can do so by adding raw `iframe` html elements inside the body of your article. For example:

```
Here is my first paragraph, right before the video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/C2g37X_uMok" frameborder="0" allowfullscreen></iframe>

Here is my second paragraph, right after the video.
```

For more details about this approach, see the **Escape hatch** section below.

# Escape hatch for content creators: writing HTML inside markdown
Markdown is a great writing tool, but it may be somewhat lacking in the formatting department. If you really need to add some extra html markup or CSS styling to specific parts of your articles (this is an extra power, so should be used sparingly, if ever), you can do so by switching to raw html.

Here is an example of mixing Markdown with HTML in Markdown files:

```
<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Caution:
>
>This page describes **experimental features that are not yet available in a stable release**. Don't rely on experimental builds of React in production apps. These features may change significantly and without a warning before they become a part of React.
>
>This documentation is aimed at early adopters and people who are curious. **If you're new to React, don't worry about these features** -- you don't need to learn them right now.

</div>

<iframe width="560" height="315" src="https://www.youtube.com/embed/C2g37X_uMok" frameborder="0" allowfullscreen></iframe>

This page provides a theoretical overview of Concurrent Mode.
```

Notice how:
- There are `style`, `div`, and `iframe` html elements in this example
- The `style` block defines CSS rules for the class added to the `div`
- The Caution block inside the `div` is written in Markdown. Just for the fun of it, it is formatted as a blockquote using the Markdown's leading angle bracket

(See `docs/article/ensembl-select.md` as an example of mixing of such syntax).

# How to publish content
Push committed changes to the master branch of this repository. A build script will run automatically, and a bot will post a comment to your commit, notifying you whether your changes have been deployed successfully. In case of a successful deployment, it will also provide links to where the code has been deployed.

A push to master will make the changes available at https://zeit-serverless-exercise.now.sh (see below). You can also push to your own branches, in which case the bot will still deploy your changes and report to you in a comment to your commit the urls where the changes got deployed. Notice that the hostname in the urls will be slightly different; so in order to check your changes you will have to use this modified url.

No changes to branches other than master will be visible in contextual help on Ensembl website.

# How to verify the result of your changes

## On a feature branch of the new Ensembl website

_Prerequisite: you must be on the EBI VPN_

- make changes in the file `docs/article/select-a-species.md` or `docs/article/using-the-genome-browser.md`, push the changes to the master branch of this repo, and wait until the bot posts a comment that the build has been successful (usually takes less than a minute)
- visit http://hx-rke-wp-webadmin-14-worker-1.caas.ebi.ac.uk:30178/app/species-selector for Species Selector or http://hx-rke-wp-webadmin-14-worker-1.caas.ebi.ac.uk:30178/app/browser/homo_sapiens_GCA_000001405_27 for Genome Browser
- click on the help and docs icon in the top right corner of the screen
- confirm that your changes are visible in the popup

Note: For the purposes of this prototype, only the two above articles are associated with contextual help.

## On the documentation website prototype
_Note: this is currently very, very basic. Please do not be alarmed by the lack of styling. The point of this exercise is only to make sure that the content has been successfully deployed as expected_

Visit https://zeit-serverless-exercise.now.sh, where you will see a list of links with file names of your articles. Click on a link, and explore the page. This workflow simulates your experience with writing standalone help pages.

Articles that have `related-video` field in their frontmatter will be displayed differently from the articles that don't (example of an article that does is `select-a-species`).

## Looking behind the scene

### Article api
If you are curious about how documentation data gets delivered to the Ensembl website, you can inspect the json response from the api endpoints of this prototype. In order to do so, enter a url built according to the following pattern: `https://zeit-serverless-exercise.now.sh/api/article?file=<name_of_your_file>` (example: https://zeit-serverless-exercise.now.sh/api/article?file=ensembl-select).

### Search api
The prototype can also search the content of articles. To check whether the search works properly, you can test it via the json api by visiting the url constructed according to the following pattern: `https://zeit-serverless-exercise.now.sh/api/search?query=<word_to_search>`, for example: https://zeit-serverless-exercise.now.sh/api/search?query=ensembl

# Future development

## How will this solution manage content when this gets into hundreds of elements?

Please take a look at [Microsoft's repository for Azure docs](https://github.com/MicrosoftDocs/azure-docs) for inspiration. Specifically, explore their `articles` and `bread` folders. Notice how articles are grouped together by topic. Notice too that apart from the yaml frontmatter in markdown files themselves, each folder with related articles contains a top-level `TOC.yml` and `index.yml` file, which contain metadata linking the articles together. We could organize our code in a similar manner to ensure good scalability.

## How will this solution enable linking between content nodes

Each content node is a file. Links to other files will be added to article metadata, either in the frontmatter of markdown files themselves (see, for example, the `parent` or the `related-video` fields example markdown files in the `docs` folder), or in individual yaml files (see `TOC.yml` or `index.yml` files in the Microsoft Azure docs repo).
