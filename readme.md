<div>
  
<h3>FastCat Catalogues: Interactive Entity-based Exploratory Analysis of Archival Documents</h3>

  <p>
    <b>FastCat Catalogues</b> is a Web application that supports researchers studying archival material, such as historians, in exploring and quantitatively analysing the data (<i>transcripts</i>) of their archival sources. The application makes use of JSON technology and is configurable for use over any type of archival documents whose contents have been transcribed and exported in JSON format. 
    The supported functionalities include:
    <ul>
<li>source- or record-specific entity browsing 
<li>source-independent entity browsing 
<li>data filtering 
<li>inspection of the provenance of any piece of information (important for verification or further data exploration) 
<li>data aggregation and visualisation in charts
<li>data export for further (external) analysis
  </ul>
 </p>
 <p>
  <b>FastCat Catalogues</b> has been deployed in the context of the <a href="https://sealitproject.eu/">SeaLiT project</a> for supporting historians in exploring a large and diverse set of archival sources related to maritime history. The application is available at: <a href="https://catalogues.sealitproject.eu/">https://catalogues.sealitproject.eu/</a>
  </p>
</div>

<!--
<!-- TABLE OF CONTENTS 
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
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
    <li><a href="#ack">Acknowledgements</a></li>
  </ol>
</details>
-->



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

### Change the IP of the API

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


<!-- Configuration -->
## Configuration
<p>
<b>FastCat Catalogues</b> operates over a set of JSON files, each one containing the transcribed data of a single archival document. 
The JSON files are organised in folders, each one containing files of the same JSON structure (representing a type of archival source).  
</p>

<p>
For configuring <b>FastCat Catalogues</b>, we first need to define the file <b>'templates.json'</b>. In this file, we need to provide for each different type of archival source: i) a category name (used for grouping the different types of sources), ii) an ID, iii) a name (shown in the user interface), iv) a description (shown in the user inteface), and v) the name of its configuration file (more below).
</p>
<p>
Then, we need to define the configuration file of each type of source. This file defines i) the <i>entities of interest</i> that appear in this type of source and which will be available for exploration (e.g., 'Persons', 'Origin Locations', etc.), and ii) the JSON fields that define the name of a record of this type of source (field 'Title'). For each entity of interest, we define the JSON fields that provide entity-related information.
</p>


<!-- Acknowledgements -->
## Acknowledgements

This work has received funding from the European Union's Horizon 2020 research and innovation programme under the Marie Sklodowska-Curie grant agreement No 890861 (Project ReKnow). 

<p align="right">(<a href="#top">back to top</a>)</p>
