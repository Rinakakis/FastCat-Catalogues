<div id="top"></div>

[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Rinakakis/seaLit">
    <img src="seaLit\src\assets\sealit.png" alt="Logo" width="160" height="auto">
  </a>

<h3 align="center">“SeaLit Catalogues” a Dynamic and Configurable Web Application for Exploring Archival Sources of Maritime History</h3>

  <p align="center">
    SeaLit Catalogs is an online application that offers a way to navigate FastCat data by defining categories of entities such as ships, sailors, voyages and ports, etc. and creating relationships between them. The application allows data navigation and provides the ability to visualize the data in charts, download it for further analysis, or visit the transcripts.
    <br />
    <a href="https://catalogues.sealitproject.eu/">View the application</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
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



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://catalogues.sealitproject.eu/)

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Angular](https://angular.io/)
* [Node.js](https://nodejs.org/en/)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* NodeJs. v16.14.0
* Angular CLI v12.2.14 
  ```sh
   npm install -g @angular/cli@12.2.14
  ```
* Java
* Tomcat

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Rinakakis/seaLit.git
   ```
2. Install NPM packages 
     * Go to \api and run
     * Go to \seaLit and run
   ```sh
   npm install
   ```

### Change the Ip of the API

- In the angular project go to seaLit\src\app\services\list.service.ts and in line 14 change   the varianble `Ip` to the Ip of the computer that th api.js will run on.

### Production build for Angular Application

- Go to /seaLit and run 
  ```sh
  ng build --base-href=/seaLit/
  ```
- This will compile an Angular app into an output directory named dist/seaLit

### Run API

- Go to /api and run
  ```sh
    npm run server
    ```

### Deployment to tomcat server

1. In the angular application go to seaLit/dist and copy the folder "seaLit"
2. Then go to your tomcat server Tomcatxx.x\webapps and paste the folder
3. After that go to Tomcat xx.x\bin and click on Tomcat10.exe
4. Open a browser to <http://localhost:8080/seaLit/>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->


[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/giorgos-rinakakis
[product-screenshot]: seaLit\src\assets\git_img.png