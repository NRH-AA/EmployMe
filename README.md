# Flask React Project

<br />
<div align="center">
  <a href="https://github.com/NRH-AA/EmployMe">
    <img src="./react-app/public/favicon.ico" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">EmployMe</h3>

  <p align="center">
    EmployMe is a custom website designed to allow job seekers to create detailed resumes
    with a clean layout. Company owners can create job listings and company pages. EmployMe
    helps job seekers and company owners find the best possible matches.
    <br />
    <a href="https://github.com/NRH-AA/EmployMe/wiki"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/NRH-AA/EmployMe/issues">Report Bug</a>
    ·
    <a href="https://github.com/NRH-AA/EmployMe/issues">Request Feature</a>
  </p>
</div>




<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>




## About The Project
'EmployMe was designed to help job seekers and company owners 
find the best possible matches.'

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With


* React
* JavaScript
* Python
* HTML
* CSS
* Flask



<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Getting started


1. Clone this repository (only this branch)

2. Install dependencies

      ```bash
      pipenv install -r requirements.txt
      ```

3. Create a **.env** file based on the example with proper settings for your
   development environment

4. Make sure the SQLite3 database connection URL is in the **.env** file

5. This starter organizes all tables inside the `flask_schema` schema, defined
   by the `SCHEMA` environment variable.  Replace the value for
   `SCHEMA` with a unique name, **making sure you use the snake_case
   convention**.

6. Get into your pipenv, migrate your database, seed your database, and run your Flask app

   ```bash
   pipenv shell
   ```

   ```bash
   flask db upgrade
   ```

   ```bash
   flask seed all
   ```

   ```bash
   flask run
   ```

7. To run the React App in development, checkout the [README](./react-app/README.md) inside the `react-app` directory.



<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Usage

<img src="./images/signup.png" alt="Logo" width="600" height="600">

Create your account with secure hashed password protection.

<img src="./images/joblist.png" alt="Logo" width="500" height="300">

The home page displays current job listings.

<img src="./images/profile.png" alt="Logo" width="500" height="300">

You can set up your profile and create posts to create your best resume.

<img src="./images/joblist.png" alt="Logo" width="500" height="300">

You can create job listings so job seekers can contact you.


<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Roadmap

- [ ] Albums for images
- [ ] Recommendations
- [ ] Company Profile Page
- [ ] Feedback/Reviews
- [ ] Messages/Inbox


See the [open issues](https://github.com/NRH-AA/EmployMe/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Contact
<pre>
Nathan Heinz - yta06291995@gmail.com
</pre>
Project Link: [https://github.com/NRH-AA/EmployMe](https://github.com/NRH-AA/EmployMe)

<p align="right">(<a href="#readme-top">back to top</a>)</p>






<p align="right">(<a href="#readme-top">back to top</a>)</p>

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
