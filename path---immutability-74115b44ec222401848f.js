webpackJsonp([21],{"./node_modules/json-loader/index.js!./.cache/json/immutability.json":function(e,a){e.exports={data:{markdownRemark:{html:'<p>I ran into an interesting bug while taking part in the <a href="https://www.starlingbank.com/">Starling Bank</a> hackathon last weekend - it was a fantastic experience being one of the first to work with an Open Banking API.</p>\n<p>I worked with 3 friends to create an automated savings app which allows you to automatically allocate funds to your savings account based on customisable rules, and track your progress towards savings goals.</p>\n<p>Check out the <a href="https://github.com/mattdean1/savings-automator">code on GitHub</a>!</p>\n<p>This will be a technical post focused on what caused the bug and how I solved it. To summarize, JS passes objects and arrays by reference, so you should be careful when updating a complex state object in React.</p>\n<h2>The Bug</h2>\n<p>The bug appeared when attempting to create a savings goal.</p>\n<p>Creating the first goal worked fine:</p>\n<p>\n</p>\n<p>But attempting to create a second goal produced some interesting behaviour:</p>\n<p>\n</p>\n<p>So the first call worked fine, and the second call added a new goal, but also updated the values of the previous one!</p>\n<p>Here is the relevant code:</p>\n<p>(I realise I shouldn\'t be storing so much in the state but this was a hackathon after all!)</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">const</span> sampleGoal <span class="token operator">=</span> <span class="token punctuation">{</span>\n  title<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n  goal<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n  raised <span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n  category<span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n  percentage<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">,</span>\n  start_date <span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n  estimated_end_date <span class="token punctuation">:</span> <span class="token string">\'\'</span><span class="token punctuation">,</span>\n  estimated_days <span class="token punctuation">:</span> <span class="token number">0</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\ncreateGoal <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newGoal <span class="token operator">=</span> sampleGoal<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>title <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>newGoalTitle<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>category <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>newGoalCategory<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>goal <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>newGoalCost<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>start_date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> goalsArray <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>goals<span class="token punctuation">;</span>\n  goalsArray<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>newGoal<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> goals<span class="token punctuation">:</span> goalsArray <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>What could be causing the issue?</p>\n<p>My initial thoughts were that something was being passed by reference where it shouldn\'t be, but we couldn\'t figure out exactly what or where.</p>\n<p>After taking a break, I came back to tackle it again. After some extensive googling I found this <a href="https://medium.com/pro-react/a-brief-talk-about-immutability-and-react-s-helpers-70919ab8ae7c">super helpful article</a>.</p>\n<h2>It’s a JS problem</h2>\n<p>Objects and arrays are passed by reference in JS. This means that a new copy is not created, and updating the \'new\' object or array actually modifies the original one.</p>\n<p>In this case I couldn\'t use <code>array.concat</code> or similar non-destructive methods, or <code>object.assign</code> as suggested in the article because I am attempting to modify a nested object so JavaScript will always pass by reference.</p>\n<h2>Immutability helper</h2>\n<p>The article I linked earlier references the built-in React Immutability Helpers, however when I visit the suggested <a href="https://facebook.github.io/react/docs/update.html">page in the React docs</a>, I find that "<code>update</code> is a legacy add-on. Use <a href="https://github.com/kolodny/immutability-helper">kolodny/immutability-helper instead</a>."</p>\n<p>This is a fantastic little module that allows us to update e.g. a complicated nested state object "without changing how the data is represented". The syntax is similar to mongodb queries, so didn\'t take long to get used to.</p>\n<p>If you\'re running into issues related to the immutability in more than one place in your application, you might want to look into a more full-featured solution like Facebook\'s <a href="https://facebook.github.io/immutable-js/">Immutable.js</a>.</p>\n<h2>The Solution</h2>\n<p>Remembering to import the library, the createGoal function now looks like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code>createGoal <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> newGoal <span class="token operator">=</span> sampleGoal<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>title <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>newGoalTitle<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>category <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>newGoalCategory<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>goal <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>newGoalCost<span class="token punctuation">;</span>\n  newGoal<span class="token punctuation">.</span>start_date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">let</span> goalsArray <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>goals<span class="token punctuation">,</span> <span class="token punctuation">{</span> $push<span class="token punctuation">:</span> <span class="token punctuation">[</span>newGoal<span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> goals<span class="token punctuation">:</span> goalsArray <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>The key line is</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">let</span> goalsArray <span class="token operator">=</span> <span class="token function">update</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>goals<span class="token punctuation">,</span> <span class="token punctuation">{</span> $push<span class="token punctuation">:</span> <span class="token punctuation">[</span>newGoal<span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n</code></pre>\n      </div>\n<p>instead of</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code><span class="token keyword">let</span> goalsArray <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>goals<span class="token punctuation">;</span>\ngoalsArray<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>newGoal<span class="token punctuation">)</span><span class="token punctuation">;</span>\n</code></pre>\n      </div>\n<p>This ensures JavaScript makes a deep copy of the necessary nested elements, instead of passing the object by reference.</p>\n<p>Many thanks to the creator of this library and to my team for having patience while we got to the bottom of this one!</p>',timeToRead:3,frontmatter:{date:"April 12, 2017",path:"/immutability",tags:["hackathon","javascript","react"],title:"Immutability"}},responsiveImage:{responsiveSizes:{aspectRatio:1.5,base64:"data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAANABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAMEAgX/xAAWAQEBAQAAAAAAAAAAAAAAAAACAQP/2gAMAwEAAhADEAAAAcN5tQ1WSlP/xAAbEAADAAIDAAAAAAAAAAAAAAABAgMAEhETIf/aAAgBAQABBQKXs9QJ5Fzt2kMrcD//xAAVEQEBAAAAAAAAAAAAAAAAAAABEP/aAAgBAwEBPwEn/8QAFREBAQAAAAAAAAAAAAAAAAAAABH/2gAIAQIBAT8BR//EABkQAAMAAwAAAAAAAAAAAAAAAAABERASIf/aAAgBAQAGPwJU1OMg1j//xAAZEAEAAwEBAAAAAAAAAAAAAAABABEhQVH/2gAIAQEAAT8hSbT75AjFdibwlStKqNR4RKJ//9oADAMBAAIAAwAAABDgL//EABcRAQEBAQAAAAAAAAAAAAAAAAEAESH/2gAIAQMBAT8QQm3L/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oACAECAQE/ELGn/8QAHhABAAICAQUAAAAAAAAAAAAAAQARIUExUWGxwfD/2gAIAQEAAT8QJzCPYcHiXlYFzL5sRhbOqMNomLqqz7hGNAFP3WYYGnc//9k=",src:"/blog/static/b4a87c7921a562bf9e7133c7181edcf7-7da9d.jpg",srcSet:"/blog/static/b4a87c7921a562bf9e7133c7181edcf7-e49f3.jpg 200w,\n/blog/static/b4a87c7921a562bf9e7133c7181edcf7-5758d.jpg 400w,\n/blog/static/b4a87c7921a562bf9e7133c7181edcf7-7da9d.jpg 800w,\n/blog/static/b4a87c7921a562bf9e7133c7181edcf7-936f0.jpg 1200w,\n/blog/static/b4a87c7921a562bf9e7133c7181edcf7-13920.jpg 1600w,\n/blog/static/b4a87c7921a562bf9e7133c7181edcf7-4950d.jpg 2400w,\n/blog/static/b4a87c7921a562bf9e7133c7181edcf7-d2579.jpg 5184w",sizes:"(max-width: 800px) 100vw, 800px"}}},pathContext:{prev:{html:"<h2>The Competition</h2>\n<p>The Microsoft Imagine Cup is a competition for students ... Microsoft describes it better than I can:</p>\n<blockquote>\n<p>Imagine Cup is a global competition that empowers the next generation of computer science students to team up and use their creativity, passion and knowledge of technology to create applications that shape how we live, work and play. Every year tens of thousands of students from across the globe compete for cash, travel and prizes and for the honor of taking home the Imagine Cup!</p>\n</blockquote>\n<p>My flatmate, Wilson, found out about the competition - after he told me and one of his friends from Uni, Sam, we decided to give it a go. Little did we know we'd make it all the way to the national finals!</p>\n<h2>Our Product</h2>\n<p>After an extensive brainstorming session resulting in many crumpled pieces of paper, we drew inspiration from the then-recently released Wetherspoons app. Their app allows you to order and pay for food and drink from your table - no more waiting at the bar!</p>\n<p>We loved the convenience and thought it'd be great to have this ability at every restaurant or bar. Some market research showed that while some large chains (McDonald's, Wagamamas) recently released apps with similar functionality, no solution existed for independent businesses, or even small to medium size chains.</p>\n<p>So, we chose to create a customer purchase and ordering platform for independent restaurants and bars:</p>\n<p>Onboarding businesses had to be as streamlined as possible, so we created a simple sign-up form, followed by a drag-and-drop web interface for the owner to create their menu. Each menu has a unique QR code for the owner to display e.g. on tables. The owner can log back in at any time to update prices or availability of menu items, which will be instantly reflected in the menu the customer sees.</p>\n<p>The customer scans the QR (or enters the menu ID on our website) and is taken directly to a mobile-optimized webapp where they can see what's on offer and add items to their basket. The customer can then submit their order and pay through PayPal - performing the entire transaction without downloading an app or creating an account!</p>\n<p>Once confirmed, the order goes straight through to a touchscreen (which could be a cheap android tablet) in the kitchen/bar for staff to fulfill. Staff can tap the screen to check orders off once they're completed and keep track of the status.</p>\n<h3>Advantages</h3>\n<ul>\n<li>The customer receives their order without leaving their seat!</li>\n<li>Restaurant can reduce front of house staff</li>\n<li>Bar can reduce average wait time</li>\n<li>Front of house staff can focus on what really matters - providing an exceptional customer experience</li>\n</ul>\n<h2>The Tech</h2>\n<p>The frontend of the app was written in Node.js and Express. We used these technologies since we all had experience with them - for this project we decided we should focus on delivering a great product, and there was still plenty to learn since we were new to the Azure platform.</p>\n<p>We got Azure credit as part of the competition, so it made sense to use Microsoft's platform to host our Node app - we also used an MSSQL database and Azure Redis for caching. I quite enjoyed using Azure - it's becoming difficult to see the differentiation between GCP, AWS, and Azure for basic hosting like this. I think to choose between platforms I'd probably consider pricing first, and for simplicity go with the platform on which I was already using less common functionality like AWS Lambda.</p>\n<h2>The UK finals</h2>\n<p>We submitted a short video pitch and our business plan. After a couple of weeks we got a very exciting email: we were through to the UK finals! The final took place at Microsoft's London offices, where we were given the opportunity to present to such dignitaries as the CTO of Microsoft Accelerator, their Principal Tech Evangelist, and the Director of Azure for Research.</p>\n<p>It was an amazing day, with sessions on entrepreneurship and tons of advice on how to start and scale a business. We got great feedback on our product - the judges highlighted our customer focus and real potential to disrupt the hospitality industry. Unfortunately we didn't make it through to the next stage of the competition, but I had a great time working with Wilson and Sam, and we all learned a lot technically, as well as about creating a startup.</p>\n<p>Some feedback from the judges:</p>\n<ul>\n<li>\"Could definitely see this taking off\"</li>\n<li>\"Slick presentation\"</li>\n<li>\"You've clearly identified and addressed a real problem in this market\"</li>\n<li>\"Solid validation from external stakeholders\"</li>\n</ul>",id:"/Users/matt/Documents/code/gatsby-blog-starter-kit/src/pages/2017-05-02-imagine/index.md absPath of file >>> MarkdownRemark",fileAbsolutePath:"/Users/matt/Documents/code/gatsby-blog-starter-kit/src/pages/2017-05-02-imagine/index.md",timeToRead:3,frontmatter:{date:"2017-05-02T11:27:49+01:00",path:"/imagine",tags:["hackathon","javascript"],title:"Imagine",summary:"Competing in the Microsoft Imagine Cup"}},next:{html:'<p>This post details how I went from knowing zero Node.js to running a 90 minute webinar on it in less than a week! To summarise, I introduced a new recruitment hackathon stream using Node.js, which increased the number of applications by <strong>25%</strong>. The students using the new platform (all of whom I also mentored), made up <strong>55%</strong> of the candidates invited to interview.</p>\n<p>The junior developer recruitment process at Eli Lilly consists of a week-long online hackathon, followed by on-site interviews. During the time I applied, the development language used for the hack was restricted to Salesforce.com.</p>\n<p>The conversion rate of applicants was fairly low for my intake, with a number of applicants failing to submit at the end of the hackathon. After consideration, and talking to some colleagues who went through this process, I spotted an opportunity to improve the number of applicants and their conversion rate.</p>\n<p>The key issue was the lack of flexibility - Salesforce is a useful platform, and experience with Java can transfer well, but for those with prior experience in web development the limitations could be frustrating. Any new platform added also needed to have a free trial, and be accessible to those with little/no experience.</p>\n<h2>Choosing the platform</h2>\n<p>Node.js on Heroku seemed like a good choice of language and platform due to its plethora of packages (allowing applicants to add complex functionality quickly), wide usage within Lilly (giving us expertise to lean on for judging), and easy integration with other free tools like GitHub.</p>\n<p>A number of tasks had to be completed before offering this application stream to the next set of applicants:</p>\n<ul>\n<li>An example application submission to demonstrate the quality of work expected</li>\n<li>Detailed mark scheme / scoring criteria</li>\n<li>Training video(s) to get those with little previous experience up to speed</li>\n</ul>\n<p>I therefore decided to simulate the hackathon process end to end using our new framework. This way I could test it out and see if it would be possible for someone who didn\'t know Node to produce something comparable to those choosing the Salesforce path.</p>\n<p>One of our graduate developers who had previous experience with Node created the scoring criteria, and off I went!</p>\n<h2>Learning Node and ideation</h2>\n<p>Step one was to learn Node.js. I collected plenty of resources - software, articles, and tutorials, then began to work through them. One particularly useful tool was <a href="https://expressjs.com/en/starter/generator.html">express-generator</a>, which creates a barebones Node.js/Express app filestructure.</p>\n<p>I then had to think of an idea. As part of the hackathon, we provide applicants with some \'challenges\' to help with the ideation phase. These take the form of quite general problems related to healthcare, for example encouraging diabetics to exercise, or distributing food around the world.</p>\n<p>The idea I settled on was to help distribute supplies to those affected by a natural disaster. <a href="https://github.com/mattdean1/quake-supply">Quake-supply</a> intends to track supplies distributed through field outposts after an earthquake.</p>\n<h2>Example submission</h2>\n<p>I created my sample app over a couple of days, learning more about Node along the way.</p>\n<p>I pull live data from the US Geological Survey API to get the coordinates and magnitude of the most recent earthquakes, and use <a href="http://leafletjs.com/">Leaflet.js</a> for mapping. I also used <a href="http://t4t5.github.io/sweetalert/">SweetAlert</a> and <a href="https://datatables.net/">DataTables</a> to help make it look presentable.</p>\n<p>Once the app was finished, I recorded a <strong><a href="https://www.youtube.com/watch?v=rwAduYXoO8I">video</a></strong> explaining the idea, the app, and how I created it.</p>\n<h2>Webinar</h2>\n<p>I ran a live webinar to give the students more information about the hackathon, show them how to get started on the platform, and give them a chance to ask questions. There was a separate webinar run for the Salesforce stream so for this one I was on my own - after a brief introduction by the sponsor of the program, it was down to me. Here\'s the structure of the content I presented:</p>\n<h4>Tools</h4>\n<p>First, I thought it\'d be a good idea to introduce the students to some of the key tooling and the platform. For this webinar I had to assume they had no previous web development experience, so it was difficult to strike a balance between being high-level and detailed.</p>\n<p>I gave a quick rundown of GitHub, PaaS, Heroku, Atom, and express-generator.</p>\n<h4>CRUD through a todo app</h4>\n<p>Secondly, I introduced the Connect, Request, Update, and Delete operations on a Node/Mongo stack by creating a basic todo app. I generated the file structure using express-generator and explained each folder, then got straight into coding.</p>\n<p>I used a pre-prepared webpage with code snippets (GitHub Gists) so those viewing the webinar could code along live or with the recording. My app was also regularly deployed and live on Heroku throughout the webinar.</p>\n<p>The tutorial was roughly split up into four sections:</p>\n<ul>\n<li>Setup, first push, importing a CSS framework</li>\n<li>Display Todos, create new Todos</li>\n<li>Add a database</li>\n<li>Delete a todo, tick off a todo</li>\n</ul>\n<h4>Scoring and Submission</h4>\n<p>Lastly, I ran through what we were looking for in a successful submission, with particular attention to the format of the submission video.</p>\n<p>I also talked about the scoring criteria and gave my final tips and tricks for succeeding in the hackathon. The webinar ended with Q and A, giving candidates valuable time to clarify anything they didn\'t understand.</p>\n<h4>Result</h4>\n<p>After the webinar, I made available on the Facebook group the list of resources I curated, the Todo app repository, the snippet webpage, and a recording of the entire thing.</p>\n<p>I got great feedback from the applicants and my colleagues, who said it was extremely clear and everything was well explained.</p>\n<h2>Mentoring</h2>\n<p>I was allocated all 6 students who chose to use Node/Heroku to mentor through the process. This consisted of encouraging them via facebook and email, and answering any questions they had about the application process or about the technology. Over the week I supported them as best as I could, and got some positive \'thankyou\' responses, but the real feedback came when it was time for judging.</p>\n<p>Myself, some other developers, and some more technically minded management came together to score the submissions and decide which candidates should be invited on-site for an interview.</p>\n<p>I was unbelievably pleased that my mentees made up <strong>55%</strong> (5 out of 9) of the interview candidates! This is likely due to a combination of factors, but I think their use of the Node/Heroku was key, as it allowed them to quickly create advanced functionality.</p>\n<h2>Continued use of Node.js</h2>\n<p>Learning Node.js was a key milestone in my journey as web developer, and I\'ve gone on to use it in a number of apps at work, also becoming the nominal Node.js consultant for our internal PaaS service.</p>\n<p>Example projects I used it in include: an <a href="https://github.com/mattdean1/nodejs-oidc-client-example">OpenID Connect accelerator</a>, a number of metrics dashboards (in combination with <a href="http://www.chartjs.org/">Chart.js</a>), and <a href="https://github.com/mattdean1/reMINDer">a reminder system for people with Alzheimer\'s</a>.</p>\n<p>I\'m currently learning React and Webpack by using them for a couple of projects in work, and although the outcome may not be as dramatic, I hope to write a post featuring these technologies soon.</p>',id:"/Users/matt/Documents/code/gatsby-blog-starter-kit/src/pages/2017-01-17-metamorphosis/index.md absPath of file >>> MarkdownRemark",fileAbsolutePath:"/Users/matt/Documents/code/gatsby-blog-starter-kit/src/pages/2017-01-17-metamorphosis/index.md",timeToRead:5,frontmatter:{date:"2017-01-17T20:39:38Z",path:"/metamorphosis",tags:["lilly","nodejs","javascript"],title:"Metamorphosis",summary:"How I went from knowing nothing about Node.js to running a 90 minute webinar in less than a week"}}}}}});
//# sourceMappingURL=path---immutability-74115b44ec222401848f.js.map