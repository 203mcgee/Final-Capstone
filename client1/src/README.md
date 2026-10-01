When I created this project, I first started to working on the App.jsx. I would put the BrowserRoutes, Routes, and Route on this page. It will eventually lead to making other important parts for the portfolio. First, I created any file that was needed and started working on the navbar. I saw a youtube video created by Leela Web Dev on how to use and also inserted some ideas from the codealong in class. (Here is the video: https://www.youtube.com/watch?v=Kui-U1ZQVvQ&t=15s) Next, I started working on my Hero section. I took some inspiration from PedroTech on youtube on the animations on the 
hero section. Here is the video: https://www.youtube.com/watch?v=LGdPMf-SgBA&t=2619s
I also look at other videos for the hero section such as WEB CIFAR. Here is the video: (https://www.youtube.com/watch?v=bJN34yW4lBI&t=1889s). When the navbar and hero sections were done, I put them in the App.jsx in the browser router. With the footer, I put in two links for to any socials.

I started to do the Home page. I decided to use a grid and put the necessary information in each one. For the project page, I had made a hook and three components for this specific page. The hook was to fetch the project and to load them into a grid. Next, I created a search bar to see which project are there. For the search bar, I also used another video from pedrotech to get the search bar working. With the experience and skills, I made three object of arrays for the timeline. This was for me to put in any information into the blocks of code. Another thing was to make an array filled with the different skills I had and put them in a grid. I watched a youtube video made by Code Radience. Here is the video: (https://www.youtube.com/watch?v=UqGIqNkhTXY). Finally with the contact page, I have recieved help from a fellow technologist and was able to create a successful form to see if all the boxes were checked off and valid email. 

How does it work?

Main.jsx has the theme provider component. The theme provider component came from a video by pedro tech. I had to download react-switch to show the switch on top of the page. I also had to use createContext and have a function called toggleTheme for the onChange function in react

App.jsx shows the BrowserRouter which keeps the page in sync with the URL. Putting the navbar,hero,and footer makes those components be on every page.

Home page section does not use any hooks or components. We had use mostly tailwindcss and sometime css. The css was used for any mishaps with the dark/light mode or the animations.

In the hero section, I have used components button and ptext for design. 

Experience and Skills section used components called Timeline. Timeline.jsx uses three functions called circle,pillar,and event card. These functions help create the timeline.

Projects section uses a hook and three components. The hook captures the data by making three variables data,isLoading,and error. Next, we make an useEffect to help with any side effect that can caused by the code  then make fetchProject to make sure the response is okay and setData to project then make sure to put the array with url at the end. Finally, the fetch function should return the variable. This will help the projects page by checking isloading and error finally adding to show projects. 

Contact section does not use any components or hooks. It works by having multiple function to handle the onChange action and having a function for form to clear the page once it is done.