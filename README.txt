# Basic form

Basic form is a formulary where i show a few things that i can do. It's also the first time i used PDO with OOP, so i'd like to upload here. With all files you can create, update, delete and select an user registered. The input's validation is in Brazilian pattern. Read the README file to know how to use it.

All comments inside all files are in portuguese.

HOW TO USE

The software that i used for php, mysql and web server was the Wampserver. It can be easily dowloaded searching on google. After downloading and installing Wampserver, open the "wamp32" or "wamp64" folder (it depends your windows version), go to www folder and paste the "PHP PDO" folder inside.

After that, initialize wamp. It will make the wamp logo appears on the acces bar. Click on wamp green logo, and select MySQL->MySQL console. Then paste all the text of the "MySQL config" file inside the project folder (PHP PDO).

Now you problably can use the form by accessing the "PHP PDO" folder after enter the localhost using your browser.

Important: if your MySQL has a password and user different from default (empty), you will need to change it on "crud.php" file: access the file, then set you password and user in "$pdoSettings" var. Change the user from root to your user, and change the password from empty to your password. Don't forget to use double quotes arround your user and password.
