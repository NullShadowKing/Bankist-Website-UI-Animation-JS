"Use Strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpemModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const openModal = (e) => {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = () => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpemModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", (e) => {
  section1.scrollIntoView({ behavior: "smooth" });
});
// Page navigation
// 1. without deligation
// this way is not efficent because when the amount of elements  increase it will inpact the speed of website
// instead we have to use event deligation
// in event deligation we use the bubble up functionality
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();

//     // smooth scrolling
//     const id = this.getAttribute("href");
//     // console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

// step 1 : we will add a event listener to the parent element that contains all the elements that we want ( add event listener to common parent element )
// step 2 : we will determine what elemtn originated the event

// best and modern way ( efficent way )
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // matching strategy (hardest part (important))
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tab Component

// we will use deligation here
tabsContainer.addEventListener("click", function (e) {
  // Matching strategy
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // Guard Clause
  // more modern way , instead of setting an if statement and then if that was true then we run our code
  if (!clicked) return;

  // remove the active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  clicked.classList.add("operations__tab--active");

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
// we use deligation here

// refactoring the func for DRY Rules
// const handleHover = function (e, opacity) {
//   if (e.target.classList.contains("nav__link")) {
//     const link = e.target;
//     const siblings = link.closest(".nav").querySelectorAll(".nav__link");
//     const logo = link.closest(".nav").querySelector("img");

//     siblings.forEach((el) => {
//       if (el !== link) el.style.opacity = this;
//     });
//     logo.style.opacity = this;
//   }
// };
// if we use bind method we dont need to get any argument in the method but instead the this keyword become the value that we pass to bind method , also we can add multiple args too.
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });
// better way
// passing an argument into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// Sticky Animation
// 1. old way because the scroll event is not efficent
// this method will affect the speed of the page because the event happen so much time ( specially it will affect the mobile users experince )
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// 2. New Way
// Sticky navigation: Intersection API
// ***************************************************************** simple explanation : when 10 percent(threshold value) of the section element observed in the viewport by observer so the following method will be run both at the start and the end ( here means when the observer observe the first 10 percent of element at viewport and also when observer observe the last 10 percent of the element at view port (10% top and 10% bottom part of the section or its better to say element )) you can use this to use the values in the method : console.log(entry);
// also imporatant note , i mentioned viewport because we used null in the observer options for root ********************************************************************
// this way is better because the amount events that happen will decrease and only happen at certain points
// const obsCallBack = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// // for excercise
// // const obsOptions = {
// //   root: null,
// //   threshold: 0.1,
// // };

// const obsOptions = {
//   root: null,
//   // [enter the view , move out the view]
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

// solution
// this is the best solution
const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries; // === const [entry] = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // this 90px is the height of nav container
  // root margin only accept px value and it wont support percent or rem
  // rootMargin: "-90px",
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Revealing Elements on Scroll
// Reveal Sections
// point we will add hidden class in js so the users who turned off js in their browser could see the website

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  // unobserve will improve the speed
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});
// we use foreach instead of map because we are not envolved to make a new array
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazing loading images for improving the page speed
// the following code will select the images that have the data-src
const imgTargets = document.querySelectorAll("img[data-src]");
// console.log(imgTargets);
const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // we have to use this listener so the users with slow connection wont see the low res images , so this listener will remove the blur effect when the images load completly
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

/////////
////////
// Slider Component
const sliderComponents = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnright = document.querySelector(".slider__btn--right");
  const slider = document.querySelector(".slider");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // events
  // Next Slide
  btnright.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    // short circuting
    e.key === "ArrowRight" && nextSlide();
  });

  // for dots we need to use deligation
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

sliderComponents();
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
// Dom Traversing
// const h1 = document.querySelector("h1");

// // Going Downwards : Child
// // Depth doesn't matter because we go to the depth
// console.log(h1.querySelectorAll(".highlight"));
// console.log(h1.childNodes);
// // it will give us a html element and it live and will updated
// console.log(h1.children);
// h1.firstElementChild.style.color = "white";
// h1.lastElementChild.style.color = "white";

// // Going upwards: parents
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest(".header").style.background = "var(--gradient-secondary)";

// h1.closest("h1").style.background = "var(--gradient-secondary)";
// Point :
// queryselector will find the childrens no matter how deep they are
// closest find parents , they are opposite

// Going sideways: siblings (only previous and next one)
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// how to get all siblings (trick)
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = "scale(0.5)";
// });

// if we want to apply a css style to entire page we need to use document.documentElement , because the document alone is not a DOM Element
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelectorAll(".section"));
// const allSections = document.querySelectorAll(".section");
// console.log(allSections);

// console.log(document.getElementById("section--1"));
// // getelemtnbytagname will return a htmlCollection that this collection will update autommatically , ************** this is really important *************** Point : ***Nodelist won't update auto***
// const allButtons = document.getElementsByTagName("button");
// console.log(allButtons);
// // this method will return a auto htmlcollection
// console.log(document.getElementsByClassName("btn"));

// Creating and inserting elements
// 1.
//insertAdjacentHTML
// Example
// const displayMovements = function (movements, sort = false) {
//   containerMovements.innerHTML = "";

//   const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? "deposit" : "withdrawal";
//     const html = `
//     <div class="movements__row">
//      <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//      <div class="movements__value">${mov} $</div>
//     </div>
//     `;

//     containerMovements.insertAdjacentHTML("afterbegin", html);
//   });
// };

// 2.
// const header = document.querySelector(".header");
// // we use this way if we want to create element from scratch
// // More programmatical way
// const message = document.createElement("div");
// message.classList.add("cookie-message");
// // message.textContent = "We use cookies for improve functionality and analytics.";
// message.innerHTML =
//   'We use cookies for improve functionality and analytics <button class="btn btn--close-cookie btn-cookie">Got It!</button>';
// // prepend will add the element as the first child of the target element
// header.prepend(message);
// // append will add the element as the last child of the target element
// header.append(message);
// // we can not only use append and prepend to add elements but also we can use them to move elements
// // for having the same element add several time we have to use cloneNode
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
// document.querySelector(".btn--close-cookie").addEventListener("click", () => {
//   // this is a stright way
//   // we also use queryselector to select the message and then remove it too
//   message.remove();

//   // Point : the remove method is new : in the old school way we have to select the parent and remove the child *********
//   // message.parentElement.removeChild(message);
// });

// // Styles
// // this styles will apply inline
// message.style.backgroundColor = "#37383d";
// message.style.width = "120%";
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";

// // in the normal way we only can get styles that applied inline but styles in css files are invisible for showing the console by js but there is an solution too
// // console.log(message.style.height);
// // but this solution return a huge collection of data that we can call properties
// console.log(getComputedStyle(message));
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);
// console.log(getComputedStyle(message).width);
// // this solution also shows the user agent styles that applied to the element
// // getcomputedstyle is really useful ***********************

// // this is root
// // we can use this way to change the styles globaly
// // document.documentElement.style.setProperty("--color-primary", "orangered");

// // Attributes
// // js only can access the standard property and attributes
// const logo = document.querySelector(".nav__logo");
// console.log(logo.alt);
// console.log(logo.className);

// // non-standard
// console.log(logo.logodesigner);
// console.log(logo.getAttribute("logodesigner"));

// logo.alt = "beautiful minimalist logo";
// console.log(logo.alt);

// logo.setAttribute("company", "Bankist Co");
// console.log(logo.getAttribute("company"));

// console.log("Absolute version : " + logo.src);
// console.log("Relative Version : " + logo.getAttribute("src"));

// const link = document.querySelector(".google__link");
// console.log(link.href);
// console.log(link.getAttribute("href"));

// const link2 = document.querySelector(".nav__link--btn");
// console.log(link2.href);
// console.log(link2.getAttribute("href"));

// // Data attributes
// // we use data to store data in UI
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add("c", "j");
// logo.classList.remove("c", "j");
// logo.classList.toggle("c");
// logo.classList.contains("c");

// // don't use this because it will override all classes and let you only set one class for the elements
// // logo.className = "Iman";

// scrolling Effect

// 1. old school
// const s1coords = section1.getBoundingClientRect();
// console.log(s1coords);
// console.log(e.target.getBoundingClientRect());
// console.log("Current scroll (x/y)", window.pageXOffset, window.pageYOffset);
// console.log(
//   "height/width viewport",
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );
// Scrolling
// window.scrollTo(
//   s1coords.left + window.pageXOffset,
//   s1coords.top + window.pageYOffset
// );

// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: "smooth",
// });

// 2. New Modern Way

// const h1 = document.querySelector("h1");

// h1.addEventListener("mouseenter", (e) => {
//   alert("addEventListener: Great! tou are reading the heading :D");
// });
// you can find different types of events on MDN

// there a on event for all events
// old school
// h1.onclick = (e) => {
//   alert("addEventListener: Great! tou are reading the heading :D");
// };

// addeventlistener is the new modern way
// addeventlistener is better becuse we can use multiple events for the same element without problem but the on(method name) way will override the second one
// and also in eventlistener we can remove a event too
// but we have to put our function in a named function

// good way for only one time messages
// const alertH1 = (e) => {
//   alert("addEventListener: Great! tou are reading the heading :D");
//   // h1.removeEventListener("mouseenter", alertH1);
// };

// h1.addEventListener("mouseenter", alertH1);

// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);

// third way the worst way
// we define func in js and then we pass the func to the html tag directly
// and also we can set the func on html too
// really olllllllllld school way , terrible

// // random color : rgba(0-255,0-255,0-255);
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgba(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// // console.log(randomColor(0, 255));

// document.querySelector(".nav__link").addEventListener("click", function (e) {
//   // console.log("link");
//   // console.log(this);
//   // console.log(this.style);
//   // console.log(this.style.backgroundColor);
//   this.style.backgroundColor = randomColor();
//   console.log("Link", e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // stop propagation
//   // its not a good idea to do this
//   // sometime fix problem for complex apps with so many listeners for one element but its not a good idea to do it
//   // e.stopPropagation();
// });

// document.querySelector(".nav__links").addEventListener("click", function (e) {
//   // console.log("link");
//   this.style.backgroundColor = randomColor();
//   console.log("Container", e.target, e.currentTarget);
// });

// document.querySelector(".nav").addEventListener(
//   "click",
//   function (e) {
//     // console.log("link");
//     this.style.backgroundColor = randomColor();
//     console.log("Nav", e.target, e.currentTarget);
//   },
//   // the reason when we set this on true the nav element become the main target is that it will capture in the way of listener to down instead of normal situation that happens going up ( if its not clear watch the video 10 of s13)
//   true // dafult value is false
// );

// // bubbling is really important for deligation

//////////// LIFE CYCLE

// this listener only wait for html and js but not other external resources like images etc
// so this event is useful when we want to exec some code after DOM created
// POINT : if we put our script tag at the end of our page in html we dont need this method (for the purpose of loading our js code after dom is ready)
// document.addEventListener("DOMContentLoaded", function (e) {
//   console.log("HTML parsed and DOM tree built!", e);
// });

// Point the jquery document.ready is equal to DOMContentLoaded
// the load event only happend when the page is completely loaded
// window.addEventListener("load", function (e) {
//   console.log("Page fully loaded", e);
// });

// this event happend just before the user leave the page
// we can add the messages that ask users if they really want to leave the page
// use this event only in important situations for example when user try to leave a page in middle of an important operation (like banking operations)
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   alert("are you sure that you want to leave the page?");
//   e.returnValue = "";
// });
