<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Rinakakis/seaLit">
    <img src="seaLit\src\assets\sealit.png" alt="Logo" width="160" height="auto">
  </a>

<h3 align="center">“SeaLit Catalogues” a Dynamic and Configurable Web Application for Exploring Archival Sources of Maritime History</h3>

  <p align="center">
    SeaLit Catalogues is an online application that offers a way to navigate FastCat data by defining categories of entities such as ships, sailors, voyages and ports, etc. and creating relationships between them. The application allows data navigation and provides the ability to visualize the data in charts, download it for further analysis, or visit the transcripts. Τhe application reads the exported JSON files from the fastcat database and with the use of the configuration files of each source builds the entities that we want and the complex connections between them.
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
        <li><a href="#change-the-ip-of-the-api">Change the Ip of the API</a></li>
        <li><a href="#production-build-for-angular-application">Production build for Angular Application</a></li>
        <li><a href="#run-the-api">Run the API</a></li>
        <li><a href="#deployment-to-the-tomcat-server">Deployment to the tomcat server</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<a href="https://catalogues.sealitproject.eu/">
    <img src="seaLit\src\assets\git_img.png" alt="Logo">
  </a>

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Angular](https://angular.io/)
* [AG-Grid](https://www.ag-grid.com/)
* [Chart.js](https://www.chartjs.org/)

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these steps.

### Prerequisites

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

### Run the API

- Go to /api and run
  ```sh
    npm run server
    ```

### Deployment to the tomcat server

1. In the angular application go to seaLit/dist and copy the folder "seaLit"
2. Then go to your tomcat server Tomcatxx.x\webapps and paste the folder
3. After that go to Tomcat xx.x\bin and click on Tomcat10.exe
4. Open a browser to <http://localhost:8080/seaLit/>

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#top">back to top</a>)</p>
