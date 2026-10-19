// Arrays of headings and image URLs
const sorArr = [
  { name: "SoR - Bandit", img: "../images/bandit-design.png"},
  { name: "SoR - Quick Draw", img: "../images/quickdraw-design.png"},
  { name: "SoR - Gunslinger", img: "../images/gunslinger-design.png"},
  { name: "SoR - Viper", img: "../images/viper-bg.jpeg"},
  { name: "SoR - Red Back", img: "../images/redback-bg.jpeg"}
];

const syndicateArr = [
  { name: "Syndicate - Nemesis", img: "../images/nemesis-design.png" },
  { name: "Syndicate - Quick Draw", img: "../images/quickdraw-design.png" },
  { name: "Syndicate - Vex Krueger", img: "../images/vexkrueger-design.png" },
  { name: "Syndicate - Pyro II", img: "../images/pyromaniac-design.png" },
  { name: "Syndicate - Tiger Hide", img: "../images/tigerhideenhanced-bg.jpeg" },
];

/*Retrieve correct array based on script id*/
let content;
let script = document.getElementById("sor-teamscript");
if(script != null)
{
	content = sorArr;
}

script = document.getElementById("syndicate-teamscript");
if(script != null)
{
  content = syndicateArr;
}

//throw an exception if no matching script was found
if(content == null)
{
	throw new Error("Array of team members is empty. Returning...");
}

//a 'let' variables cannot be redeclared in the same scope
let currentIndex = 0;

// Get references to elements
const nameElement = document.getElementById("characterName");
const imgElement = document.getElementById("characterImage");

// Add click event listener
imgElement.addEventListener("click", () => {
  // Update index
  currentIndex = (currentIndex + 1) % content.length;

  // Update the name and image
  nameElement.textContent = content[currentIndex].name;
  imgElement.src = content[currentIndex].img;
});
