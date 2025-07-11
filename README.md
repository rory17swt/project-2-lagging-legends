# Lagging Legends 
## Description:
Lagging Legends is a CRUD-based indie games hub where users can explore, share, and add their favourite indie games. I built this project at the end of my second module,
focusing on CRUD functionality using the MEN stack (MongoDB, Express, Node.js).
Combining my passion for gaming with web development, I set out to create a user-friendly platform for fellow gamers to discover and celebrate the world of indie games.

## Deployment Link:
You can view Lagging Legends here: https://lagging-legends-app.netlify.app/
You can browse and explore indie games without creating an account, but to unlock the full experience, including adding, updating, and deleting your game entries, you'll need to sign up and log in.

## Accessing My Code:
You can find my code on GitHub following this link: https://github.com/rory17swt/project-2-lagging-legends

## Timeframe / Solo or Team Project:
This project was completed independently over 4 days. I worked solo, managing all aspects of the design, development, and implementation.

## Technologies Used:
### Back End:
-	Node.js – JavaScript runtime environment
-	Express.js – Web framework for handling routing and middleware
-	MongoDB – NoSQL database for storing game and user data
-	Mongoose – ODM for MongoDB, used to structure and manage models
-	Express-Session – Session management for user authentication
-	Connect-Mongo – Stores session data in MongoDB
-	Method-Override – Allows the use of PUT and DELETE methods in forms
### Authentication and Security:
-	bcryptjs – Password hashing for secure authentication
-	dotenv – Loads environment variables for secure config management
Front End:
-	EJS (Embedded JavaScript Templates) – Templating engine for rendering dynamic pages

### Development Tools:
-	Morgan – HTTP request logger for development
-	Serverless-HTTP – Prepares the Express app for serverless deployment (e.g., Netlify)

## Brief:
For this project, we were tasked with building a full-stack application using the MEN stack, with a focus on implementing full CRUD functionality. Before receiving approval to begin development,
we were required to present our wireframes and database design (DBD) diagram to our instructor.
### MVP:
-	The app utilises EJS Templates for rendering views to users.
-	The app uses session-based authentication.
-	The app’s files are organised following the conventions taught in lectures.
-	The app has at least one data entity in addition to the User model. At least one entity must have a relationship with the User model.
-	The app has full CRUD functionality.
-	Authorisation is implemented in the app. Guest users (those not signed in) should not be able to create, update, or delete data in the application or access functionality that allows these actions.
-	The app is deployed online so that the rest of the world can use it.
### UI/UX:
-	Your app exhibits a visual theme, like a consistent colour palette and cohesive layout across pages.
-	CSS Flexbox or Grid is utilised for page layout design.
-	The site is easily navigable by a first-time user. For example, navigation should be done through links instead of having to type in a URL to navigate around the app.
-	Colours used on the site have appropriate contrast, meeting WCAG 2.0 level AA standards.
-	When editing an item, the form is pre-filled with that item’s details.
-	Only the user who created the data can see and interact with the UI for editing or deleting that data.
-	All images on the site have alt text.
-	No text is placed on top of an image in a way that makes the text inaccessible.
-	All buttons are styled.

## Planning:
### Wireframes:

IMG
 
I created wireframes to visualise the different user flows and routes within the app, which helped streamline the development process, with the potential to add a profile page,
comments and likes as a stretch goal. I also made a clear distinction between routes accessible to all users and those that require authentication, ensuring it was easy to understand
how the experience changes when a user is signed in or not.
To support the back-end structure, I created a Database Design (DBD) diagram that maps out the relationships between the models in my application.
This helped guide the schema setup and ensured consistent data flow during development:

### DBD Diagram:

IMG
 
In the diagram, I’ve outlined several key relationships: a one-to-many relationship from users to games, users to likes, users to comments, and from games to comments.
There’s also potential to implement a many-to-many relationship between games and likes to allow multiple users to like multiple games.
### Pseudocode for my sign-in route:
<pre>
Make a POST request to the sign-in route
Find the user in the database using the users email address
If the user couldn’t be found, render the sign-in page with an error
Compare the password with the hashed password in the database
If the password is incorrect, render the sing-in page with an error
If the users credentials are valid, store the user in the session
Save the session, redirect the user to the explore page
  </pre>
This served as a step-by-step guide before implementing the actual code, helping me stay organised and avoid missing any critical stages in the sign-in process.

## Code Process:
I began by setting up the server.js file and configuring my .env file to connect to MongoDB and start the server on the specified port. Next, I imported essential middleware such
as method-override. Additional imports were added progressively as they became necessary during development.
Once the server was up and running, I started building out my views, beginning with home.ejs. Throughout the project, I continued to create new views in parallel with their
respective routes to maintain a steady workflow.
After that, I moved on to building my models. I started with the Game schema, which allowed me to begin developing the game controller and testing routes using Postman.
Once the game functionality was in place, I created the User model and built out the Auth controller to handle user registration and login.
To secure and manage routes, I developed custom middleware. This included:
-	A middleware to check if the currently signed-in user is the owner of the game they're trying to edit etc.
-	A sign-out middleware to restrict access to certain routes based on authentication status.
-	A Cloudinary parser middleware, since uploading an image is required when creating a game.

Finally, I seeded the database with users and games using ChatGPT to help generate placeholder data. I deployed the completed project to Netlify, following the platform’s deployment instructions
for serverless back-end setup.
### Edit route:
<pre>
router.get('/games/:gameId/edit', isSignedIn, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return next()
        }
        const game = await Game.findById(req.params.gameId)
        if (!game) return next()

        if (!game.author.equals(req.session.user._id)) {
            return res.redirect(`/games/${game._id}`)
        }
        return res.render('games/edit.ejs', {
            game: game
        })
    } catch (error) {
        console.log(error)
    }
    
})
  </pre>

This GET route allows only authenticated users to access the edit page for a game they created. It first checks whether the gameId is a valid MongoDB ObjectId. If not, it skips to the next middleware (e.g., 404 handler). Then it verifies whether the game exists. Finally, it checks if the currently signed-in user is the author of the game. If not, the user is redirected to the game's show page.
I added the isSignedIn middleware once I had finished implementing user authentication. 

### POST route for user creation:
<pre>
router.post('/auth/sign-up', isSignedOut, async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.password !== req.body.passwordConfirmation) {
            return res.status(422).render('auth/sign-up.ejs', {
                errorMessage: 'Please make sure your passwords match'
            })
        }
        req.body.password = bcrypt.hashSync(req.body.password, 12)

        const newUser = await User.create(req.body)

        return res.redirect('/')

    } catch (error) {
        console.log(error.message)

        if (error.code === 11000) {
            const fieldName = Object.keys(error.keyValue)[0]

            return res.status(422).render('auth/sign-up.ejs', {
                errorMessage: `That ${fieldName} already exists`
            })
        }
        return res.status(400).render('auth/sign-up.ejs', {
            errorMessage: error.message
        })
    }
})
  </pre>

This route is protected by the isSignedOut middleware to ensure that only users who are not currently signed in can access it. When a user submits the create an account form,
the route first checks whether the password and confirmation password match. If they don’t, the form is re-rendered with an appropriate error message, telling the user to
correct the issue. If the passwords do match, the password is securely hashed using bcrypt.
Once validation is complete a new user is created in the database using User.create(). If the user attempts to register with an email or username that already exists, MongoDB throws
a duplicate key error (code 11000), which is handled by displaying a clear message indicating which field is already taken. Any other errors are also caught and shown to the user through
the sign-up.ejs view. This approach ensures the sign-up process is secure and user-friendly.

### Cloudinary and Multer:
<pre>
// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDNINARY_API_KEY,
    api_secret: process.env.CLOUDNINARY_API_SECRET
})

// Storage object - How and where our files are stored
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lagging_legends_uploads',
        allowed_formats: ['png', 'jpeg', 'JPEG', 'jpg', 'webp', 'gif', 'GIF'],
        public_id: (req, file) => {
            return Date.now() + '-' + file.originalname
        },
    },
})

// Parser function - takes the image and provides a req.file key
const parser = multer({ storage: storage})
  </pre>

First, I set up the Cloudinary configuration using the environment variables for the cloud name, API key, and API secret. This ensures that sensitive information stays.
Next, I created a custom storage object using CloudinaryStorage, which defines how and where uploaded images are stored. All images are uploaded to a specific folder called
"lagging_legends_uploads" within my Cloudinary account. I also specified a list of allowed image formats. At first, I was having issues when uploading images and realised it
was because my only allowed format was png . To make each file name unique, I used a timestamp combined with the original file name as the public_id.
Finally, I set up a Multer parser middleware using the defined storage configuration. This parser takes the uploaded image from the form and makes it accessible via req.file,
which allows me to easily attach the image to a new game post or update an existing one. This setup allows users to upload images in a streamlined and secure way, improving 
both functionality and user experience.

## Challenges:
I encountered three main challenges during this project.
Firstly, during the planning stage, I needed to ensure I approached the build in an efficient and logical order. Although I initially wrote out a rough build plan, I later realised I had missed
some key steps, which affected my workflow. To improve this in future projects, I plan to use a Trello board to help visualise and manage my tasks more effectively, ensuring a smoother and more
organised development process.
Secondly, at the beginning of the build, I found myself focusing too much on the final product instead of breaking the work down into smaller, manageable tasks. This made the early stages feel
overwhelming. To overcome this, I took a step back and began writing detailed pseudocode, which helped clear my head and allowed me to start treating the tasks as building blocks. 
Lastly, when it came to styling the app, I felt a bit overwhelmed due to my limited knowledge of CSS. Knowing this, I set aside a day specifically for researching and improving my understanding 
of CSS. This gave me the confidence and tools I needed to implement the design I had envisioned for my app.

## Key Learnings:
This project showed me how JavaScript can be applied in real-world scenarios. Rather than solving coding problems, I was able to take what I had learned and use it to build a fully functional web
application. I now have a much clearer understanding of how the MEN stack works, with Node.js acting as the foundation, Express.js sitting on top to define routes and handle CRUD operations, and
MongoDB serving as the database where all the data is stored.
This project helped me realise that the planning stage is essential and should be carefully planned out. Having a well-defined, detailed roadmap from the start is crucial to avoiding confusion
and staying focused throughout the build process.
Using EJS templates for the frontend allowed me to dynamically render content and pass data from the backend directly into my views. Throughout the project, I developed a stronger understanding
of EJS syntax, including how to use conditionals, loops, and embed JavaScript within HTML. This not only improved my templating skills but also gave me a better grasp of how the frontend and backend
communicate in a full-stack application.

## Future Improvements:
As outlined in my initial plan, if I had more time, I would have liked to implement a user profile page where users could view the games they've added, introduce a like feature that displays liked games
on their profile, and add a comment section for each game post. These were my stretch goals, but I chose to dedicate more time to refining the CSS and resolving any bugs or issues within the core functionality
of the app. In future projects, now that I have a stronger grasp of CS, I plan to shift more focus toward implementing additional features and fully exploring the stretch goals I set for myself.

