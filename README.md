# Spicetify-Extensions

![image](cover.jpg)

## What is this?

This is a collection of [Spicetify](https://spicetify.app/) extensions I created, written in [TypeScript](https://www.typescriptlang.org/).  

Huge thanks to the Spicetify team for making this possible and to everyone who helped me on Discord.

## How do I download an extension?

You have two ways to get an extension: through the marketplace or manually.  
I really recommend using the marketplace to make getting extensions easy, to keep your extensions organized and to make updating them automatic.

## Downloading an extension using the marketplace

### Installing the marketplace

First you need to make sure the marketplace is installed.  
When starting Spotify, if you see an icon that says `Marketplace` on your sidebar on the left then you're good to go.  
Otherwise follow the instructions on [Spicetify's website](https://spicetify.app/docs/getting-started) or on [Spicetify Marketplace's repository](https://github.com/spicetify/spicetify-marketplace/wiki/Installation).

### Installing an extension using the marketplace

Click on the `Marketplace` icon in your Spotify sidebar, then in the search bar search for the name of an extension by replacing `-` with spaces. For example `startup page`.  
You can also simply search up my Github name to list all of my published extensions.

## Downloading an extension manually

### Downloading an extension manually from this repository

Go in the `dist` folder of the extension you want to download, click on the file then click on `Raw`.

<details>
  <summary>Image</summary>
  
  ![image](https://user-images.githubusercontent.com/55228336/203532286-5b39ddce-1786-4e11-a0fe-b04c866c67a8.png)
  ![image](https://user-images.githubusercontent.com/55228336/203532319-c3d13954-2b86-418e-a493-ebb21c636b2b.png)
</details>

Right click anywhere and click on `Save page as` (or an equivalent).  

Make sure to put `All` or `Any` for the file type and to add `.js` at the end of the file name.

<details>
  <summary>Image</summary>
  
  ![image](https://user-images.githubusercontent.com/55228336/203532444-7abb153c-b341-46ca-9d5c-6bd6a426befe.png)
</details>

### Installing an extension manually

Follow the instructions in [Spicetify's documentation](https://spicetify.app/docs/advanced-usage/extensions/)

## Building an extension

If you want to build an extension yourself you can follow these instructions

- Clone this repository
- `cd` in the folder of the extension you want
- Run `npm i` to install all dependencies
- Follow the instructions in [Spicetify's documentation](https://spicetify.app/docs/development/spicetify-creator/building-and-testing)
