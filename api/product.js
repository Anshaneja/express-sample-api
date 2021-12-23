const express = require("express");
const OurApp = express.Router();
const axios = require('axios').default;
const cheerio = require('cheerio');
// router.get("/", async (req, res) => {
//   try {
//     res.json({
//       status: 200,
//       message: "Get data has successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Server error");
//   }
// });

// function which gets the data and returns object of data
const getData = async function(id){
    
    // tableinfo = [ [citations_all , citations_since 2016] , [hindex_all, hindex_since2016 ] , [i10index_all , i10index_since2016] ]
    let tableinfo = [ [0,0],[0,0],[0,0]];

    // graphinfo = [ [ year , no_of_citations ] , ... ]
    let graphinfo = [];

    const photoUrl = "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=" + id;
    const url = 'https://scholar.google.com/citations?user=' + id + '&hl=en';
    try{
        // gets the html data from the url
        const response = await axios.get(url);

        // loads the html data into a cheerio function
        const $ = cheerio.load(response.data);

        // uses cheerio function to select name from html
        const name = $("#gsc_prf_in").text();
        if( name == ""){
            throw "User not found";
        }
        console.log("name = " + name);

        // Selects and Traverses the table data and saves data into an array 'table info'
        $("#gsc_rsb_st tbody").children().each((index, elem) => {
            $(elem).children('.gsc_rsb_std').each((j, elem2)=> {
                tableinfo[index][j] = parseInt($(elem2).text());
                
            })
        });

        // Traverses graph data 'year' and add it to the array 'graphinfo
        $(".gsc_md_hist_b .gsc_g_t").each( (index, elem) => {
            graphinfo.push([parseInt($(elem).text()),0])
        });

        console.log(tableinfo);
        console.log(graphinfo);
        

        const countStr = $(".gsc_g_a").first().attr("style");
        const count = parseInt(countStr.split("z-index:").pop());
        
        // Traverses no. of citations in that particular year and saves it to array
        $(".gsc_g_a").each((index,elem) => {
            //gets the string of style attribute
            var str = $(elem).attr("style");
            console.log(str);
            var splittedArray = str.split("z-index:");
            var x = parseInt(splittedArray.pop());
            console.log(x);
            // adds the value to its correct index
            graphinfo[count - x][1] = parseInt($(elem).text());
        })

        
        // returns data object
        return ({
            name : name,
            tableData : tableinfo,
            graphData : graphinfo,
            photoUrl : photoUrl,
            status_code : response.status,
            status_text : response.statusText
        })
    }catch (error){
        console.log("Error");
        console.log(error);
        
        if(error.response){
            return ({status_code : error.response.status, status_text : error.response.statusText})
        }
        return ({status_code : 500, status_text : error})
    }
        
}


// Route    - /user/:id
// Des      - To get a user data
// Access   - Public
// Method   - GET
// Params   - id
// Body    - none
OurApp.get('/user/:id', async(req,res) => {
    try{
        const data = await getData(req.params.id);
        console.log('express code continues');
        return res.status(data.status_code).json(data);
    }catch(error){
        console.log(error);
    }

});

OurApp.get('/', (req,res) => {
    return res.json({ message: "Server is working!!!!!!" });
});


module.exports = OurApp;