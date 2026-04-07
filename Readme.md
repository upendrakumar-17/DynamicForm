This a project for creating a dynamic form.
Github link : https://github.com/upendrakumar-17/DynamicForm
Vercel link : https://dynamic-form-theta-one.vercel.app/

About The Project: 
1. On starting of the project first page is the lading page, which can be mode more visually attractive to attract the clients.
2. On the landing page there is a link that redirects to "/book" for booking for the event.
3. The event booking is divided into 3 steps:
   3.1. Select the requirements ( Planner / Performer / Crew )
   3.2. Fill out the basic information of the user. Its a static form, equiped with validation.
   3.3. The third and final steps includes the main category based questions, which are fetched from the backend database. These questions are unique for each one             category ( Planner / Performer / Crew ).
   3.4. The final page contains the submit button which saved the data into the backend.
4. There is a route for admin also "/admin", Here admin can access the user's response and can also directly add questions.
   /admin/question helps admin to show a form, with this admin can directly add question and even specify the category for question ( Planner / performer / Crew ).
   /admin/response helps admin to show the responseof the users. Here admin can see all the form responses.

BACKEND : node server.js
FRONTEND : npm run dev
