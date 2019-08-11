  //JS for the Stock Market simulator.
  /* 
  Binary Search is located at line 395
  Selection sort algorithm is located at line 256
  String manipulation function is located at line 107
  Data structure evidence is provided at 161 and within the home page (explained more in user manual)
  */

  // Your web app's Firebase configuration
  var firebaseConfig = {
      apiKey: "AIzaSyCqi29j7pAOefPmjXh_Sf9kR4m59P_yLE4",
      authDomain: "stockmarketsimulator-4da4a.firebaseapp.com",
      databaseURL: "https://stockmarketsimulator-4da4a.firebaseio.com",
      projectId: "stockmarketsimulator-4da4a",
      storageBucket: "",
      messagingSenderId: "404539084819",
      appId: "1:404539084819:web:072a32d777b098e4"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //Reference login collection
  var usersRef = firebase.database().ref('users');

  //Reference home stock collection
  var homeStocksRef = firebase.database().ref('homeStocks');

  //API link and API key for easier access to the URL
  let api = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
  let apiKey = "&apikey=RX0PHRJ4DLPRLAX0"
  let dailyStockData;

  /* 
  [REFRESH HOME BUTTON]
  This is a button on the home page that refreshes the open, closing, high, low, and amount sold values of 5 
  featured stocks. These are Apple (AAPL), Uber (UBER), Facebook (FB), Google (GOOGL), and JP Morgan (JPM). 
  In basic terms, the function is activated upon the user pressing the refresh button. Then, it pulls data from the
  5 stocks listed and pushes them into an object. From this, the object is pushed into the Firebase under the heading
  'homeStocks'. Finally, the homeLoad function is called which essentially refreshes the table and sorts all the data.
  */

  function refreshHome() {
      let xhttp = new XMLHttpRequest;

      //Create empty object to push all the stock data into with HS
      hs = {};

      //Featured stocks
      let stockSymbol = ['AAPL', 'UBER', 'FB', 'GOOGL', 'JPM'];

      //XHR creates different xmlHTTP requests for each stock, which avoids a problem where the data couldn't be caught
      let xhr = [];

      //Loop that goes for the length of the featured stocks (5) that populates hs
      for (let i = 0; i < 5; i++) {

          //URL is created from existing strings to cut down on having to deal with URL confusion
          let URL = api + stockSymbol[i] + apiKey;
          console.log(URL);
          xhr[i] = new XMLHttpRequest();
          xhr[i].open('GET', URL, true);

          xhr[i].onload = function (data) {

              //Access the JSON data in here 
              data = JSON.parse(this.response);

              //By getting the last refreshed date from the meta data, we can reference it in calling the latest data
              let latestDate = data['Meta Data']['3. Last Refreshed'];

              //The latest date that is given includes minutes, hours, and seconds which doesn't fit into the actual data
              //Thus, it's much easier to just cut it to the actual length of a regular date (10)
              trimmedLatestDate = latestDate.substring(0, 10);

              //This gets the stock symbol from the meta data
              let sym = data['Meta Data']['2. Symbol'];

              //This is the actual raw data from the latest date
              let stock = data['Time Series (Daily)'][trimmedLatestDate];

              /*
              Mod_stock is a replacement object with all the data from the original object - stock, except that
              it changes the key names such that they do not contain any fullstops, as firebase does not accept
              key names with fullstops in them.
              */
              let mod_stock = {};
              mod_stock.open = parseFloat(stock['1. open']);
              mod_stock.high = parseFloat(stock['2. high']);
              mod_stock.low = parseFloat(stock['3. low']);
              mod_stock.close = parseFloat(stock['4. close']);
              mod_stock.volume = parseFloat(stock['5. volume']);


              //Now, the stock within hs is being updated to contain all the data taken from mod_stock
              hs[sym] = mod_stock;

              //This updates the homeStock collection in Firebase everytime; it deletes old data every update per .update
              homeStocksRef.update(hs);
          }
          xhr[i].send();
      }
      //homeLoad gets the data from the Firebase and sorts it using a selection sort, shown further down
      homeLoad();
  }

  //========================================
  //  START OF STRING MANIPULATION FUNCTION
  //========================================

  //A string is passed through as a parameter. This string will look something like 'GOOGL at 2019_08_16'
  function getFirstWord(str) {

      //Gets index of the spaces within the string
      let whitespacePosition = str.indexOf(' ');

      //If there are no spaces (if the position of it is -1), then the first word is the entire string
      if (whitespacePosition === -1) {
          return str;
      } else {

          //If not, then the first word is the 1st substring and cuts off the rest of the string after the whitespace
          return str.substr(0, whitespacePosition);
      }
  }

  //=======================================
  //  END OF STRING MANIPULATION FUNCTION
  //=======================================



  /*
  Group of functions activated each time one of the top stocks in the home page is clicked. Gathers data from the 
  Firebase, then calls the function getStockInfo(i), i being whichever ranked stock they pressed 
  */

  function topstock1() {
      homeStocksRef.on('value', getStockInfo1, errData);
  }

  function topstock2() {
      homeStocksRef.on('value', getStockInfo2, errData);
  }

  function topstock3() {
      homeStocksRef.on('value', getStockInfo3, errData);
  }

  function topstock4() {
      homeStocksRef.on('value', getStockInfo4, errData);
  }

  function topstock5() {
      homeStocksRef.on('value', getStockInfo5, errData);
  }


  //getStockInfo functions get the raw data for each stock and put it on an alert to show the data structure
  //These functions all act the same, so documentation has only been provided for one so as to not repeat myself
  function getStockInfo1(data) {
      let stockData = data.val();
      let cellData = document.getElementById('topstock1').innerHTML;

      //firstWord utilises the string manipulation function 'getFirstWord' 
      let firstWord = getFirstWord(cellData);

      //AlertData is the data to be put into an alert. It grabs the raw data from Firebase at the symbol/first word
      alertData = stockData[firstWord];

      //Within the alert, the symbol is given followed by a stringified object in order to read it
      alert(firstWord + " " + JSON.stringify(alertData, null, 4));
  }

  function getStockInfo2(data) {
      let stockData = data.val();
      let cellData = document.getElementById('topstock2').innerHTML;
      let firstWord = getFirstWord(cellData);
      alertData = stockData[firstWord];
      alert(firstWord + " " + JSON.stringify(alertData, null, 4));
  }

  function getStockInfo3(data) {
      let stockData = data.val();
      let cellData = document.getElementById('topstock3').innerHTML;
      let firstWord = getFirstWord(cellData);
      alertData = stockData[firstWord];
      alert(firstWord + " " + JSON.stringify(alertData, null, 4));
  }

  function getStockInfo4(data) {
      let stockData = data.val();
      let cellData = document.getElementById('topstock4').innerHTML;
      let firstWord = getFirstWord(cellData);
      alertData = stockData[firstWord];
      alert(firstWord + " " + JSON.stringify(alertData, null, 4));
  }

  function getStockInfo5(data) {
      let stockData = data.val();
      let cellData = document.getElementById('topstock5').innerHTML;
      let firstWord = getFirstWord(cellData);
      alertData = stockData[firstWord];
      alert(firstWord + " " + JSON.stringify(alertData, null, 4));
  }


  //Global variables for the username to be used once in the actual application 
  let userUsername;
  let userPassword;

  //Global variables for the featured stocks on the homepage
  let featuredStocks;


  //Homepage initialization function called when the user logs in, or when the home stocks are refreshed
  function homeLoad() {

      //Accesses the firebase data regarding home stocks and calls the sorting function, which calls the selection sort
      homeStocksRef.on('value', stockSort, errData);
  }


  //Function called by the home loading which then utilizes the selection sort function to order stocks by price
  function stockSort(data) {

      //Accesses the raw stock data
      let stockData = data.val();

      //stockArray is an empty array for the stock name and closing data to be pushed into
      let stockArray = []

      //Loop that goes for the amount of keys in the Firebase regarding the home stocks / featured stocks
      for (var key in stockData) {
          //Pushes the key name (stock symbol) and the closing value into stockArray
          stockArray.push([key, stockData[key].close])
      }


      //sortedArray is an empty array to be filled with the sorted data from stockArray
      sortedArray = []

      //This uses the selection sort algorithm to sort closing prices from highest to lowest
      sortedArray = selecsort(stockArray)

      //New loop for the length of the featured stocks array (5) which changes the rows within the top stocks table
      for (i = 0; i + 1 <= 5; i++) {

          //Sets the innerHTML of each row to contain their respectively performing stocks, as well as closing value
          document.getElementById('topstock' + (i + 1)).innerHTML = (sortedArray[i])[0] + ' at $' + (sortedArray[i])[1];
      }
  }



  //=====================================
  //  START OF SELECTION SORT ALGORITHM
  //=====================================

  //Selection sort algorithm takes in an array to sort
  function selecsort(arr) {

      //n acts as the length of the array given
      let n = arr.length;

      //For the length of the array, the loop goes
      for (let i = 0; i < n; i++) {

          //Sets the maxIndex as whatever i is (maxIndex is a counter)
          let maxIndex = i;

          //A loop based on how far into the array it is
          for (j = i + 1; j < n; j++) {

              //If statement compares the value of the first number to the second
              if (arr[j][1] > arr[maxIndex][1]) {

                  //Sets the maxIndex as j / second position
                  maxIndex = j
              }
          }

          //It will swap the positions of each value depending on how they compare against each other given above
          swap(arr, i, maxIndex)
      }
      return arr;
  }

  //Swap function to be used in the selection sort
  function swap(A, x, y) {
      //Temporarily stores A as x
      var temp = A[x];
      //Makes y = x
      A[x] = A[y];
      //Replaces the x value with y
      A[y] = temp;
  }

  //===================================
  //  END OF SELECTION SORT ALGORITHM
  //===================================




  //User signup which takes the users input in the login fields and submits it to the Firebase if they pass the requirements
  function signupSubmission() {

      //Gathers the username, password, and the repeated password from the input fields (getInputVal is a function to get innerHTML)
      var username = getInputVal('username');
      var password = getInputVal('password');
      var passwordRepeat = getInputVal('passwordRepeat');
      var blank = "";

      /*
      If the password is the same as password repeat, and the password is not blank, and username is not blank, 
      then submit user through the saveUser function
      */
      if (password === passwordRepeat && password !== blank && username !== blank && passwordRepeat !== blank) {

          //Save signup/login info
          saveUser(username, password);

          //Alerts the user that they successfully signed up
          document.querySelector('.successfulSignupAlert').style.display = 'block'

          //Then hides the alert after 3 seconds through a setInterval of 3000 miliseconds
          setTimeout(function () {
              document.querySelector('.successfulSignupAlert').style.display = 'none'
          }, 3000);


          //If the password is not the same as the repeated password, then it will not send the information
      } else if (password !== passwordRepeat) {
          //Alerts user that passwords do not match
          document.querySelector('.unsuccessfulSignupAlert').style.display = 'block'

          //Then hides after 3 seconds
          setTimeout(function () {
              document.querySelector('.unsuccessfulSignupAlert').style.display = 'none'
          }, 3000);

          //If any field is blank, they will be alerted to fill it in
      } else if (passwordRepeat === blank || password === blank || username === blank) {

          //Alerts the user that they left something empty
          document.querySelector('.emptySignupAlert').style.display = 'block'

          //Then hides after 3 seconds
          setTimeout(function () {
              document.querySelector('.emptySignupAlert').style.display = 'none'
          }, 3000);

      }
  }

  //Function that grabs input from an HTML element used above
  function getInputVal(id) {
      return document.getElementById(id).value;
  }


  //The saveUser function submits the username and password to a generated alphanumerical key in Firebase
  function saveUser(username, password) {

      //This newUserRef allows for a NEW user to be submitted rather than replaced
      var newUserRef = usersRef.push();

      //Sets the data into the database under a randomly generated key 
      newUserRef.set({
          username: username,
          password: password
      });
  }


  /*
  Login page that checks login information to existing user information in Firebase
  */

  //Global variables for the login username and password provided by the user
  let loginUsername;
  let loginPassword;

  /*Upon pressing 'login', this function is executed which calls the getUserData function to compare provided info 
  with existing user information within the Firebase*/
  function loginSubmission() {
      usersRef.on('value', getUserData, errData);
  }

  //Global variables to be used in the user authentication and binary search
  let userKey;
  let position;

  //====================================
  //  START OF BINARY SEARCH ALGORITHM
  //====================================

  /*
  The binary search function (binarySearch) takes the parameters sortedNames (array) and loginUsername (string), 
  and will search for the login username within the sorted array of names
  */
  function binarySearch(sortedNames, loginUsername) {
      //The highest position is set to the amount of usernames in the sortedNames array (it is -1 because arrays start at 0)
      let high = sortedNames.length - 1;
      let low = 0;
      let mid = 0;

      //When the lowest position is less than or equal to the highest position, this loop occurs
      while (low <= high) {

          //The middle position is set as the amount of values in the array divided by 2
          mid = Math.floor((high + low) / 2)

          /*
          If the middle position's value is the same as login username or provided value, then it will return that, confirming 
          it was succesful in finding it
          */
          if (sortedNames[mid] == loginUsername) {

              //Returns value if successful
              position = mid;
              return sortedNames[mid];

              /*
              If the value of the login username is greater than the value of the middle value, the lowest 
              value will now be one above the middle; this essentially halves the searching area
              */
          } else if (loginUsername > sortedNames[mid]) {
              //Makes the new lowest position one above the middle, as the middle was not the right value
              low = mid + 1;

              /*
              If the value of the login username is less than the middle value, the new highest value will be one less
              than the highest. This essentially halves the searching area
              */
          } else {
              //Moves the highest position down one
              high = mid - 1;
          }
      }
      //If the search cannot find the value, it will return -1 as an error value
      return -1;
  }

  //====================================
  //  END OF BINARY SEARCH ALGORITHM
  //====================================


  //Function that retrieves firebase user info and crosschecks it with login info provided by the user
  function getUserData(data) {

      //The whole users object is provided through this variable
      var users = data.val();

      //The alphanumerical keys are provided through this
      var keys = Object.keys(users);

      //This sets the username and password that the user typed in on the login page
      loginUsername = getInputVal('loginUsername');
      loginPassword = getInputVal('loginPassword');

      /*
      Two seperate arrays: usernameArray will be populated with just usernames, whilst usersArray will be 
      populated with usernames and passwords for comparison later
      */
      let usersArray = [];
      let usernameArray = [];

      //This populates both arrays with their respective data by accessing the Firebase data through keys and childs
      for (let key in users) {
          usersArray.push([users[key].username, users[key].password]);
      }
      for (let key in users) {
          usernameArray.push(users[key].username);
      }

      //This sorts the usersArray, which is an array of arrays (usernames and passwords)
      let sortedUsers = usersArray.sort(function (a, b) {
          //Sorts the data by the first value of each array in the array (which is the username)
          return a[0].localeCompare(b[0]);
      });

      //This sorts the usernameArray, an array of strings to be searched through by the binary search function
      let sortedNames = usernameArray.sort();

      /*
      The binary search algorithm is given the sorted names array and username, then checks to see if the username 
      is in the database 
      */
      if (binarySearch(sortedNames, loginUsername) === loginUsername) {

          /*
          Now, if that username does exist within the Firebase, it will take the position of the username within
          that array and compare it with the position of the identically sorted array of usernames and passwords.
          Because they were identically sorted before, if the value of the password entered by the user and the value
          of the password in the users array (username and password) are the same, then they will be submitted onto the
          home page
          */
          if ((sortedUsers[position])[1] === loginPassword) {

              //Since the username is correct and password is too, the username is now officially what they typed in
              userUsername = loginUsername;

              //Hides the login page and shows the home page
              $(".page1").hide();
              $(".page2").show();

              //Gives the username of the user in the sidebar of every single page
              document.getElementById('sidebar-user').innerHTML = "User: " + userUsername;
              document.getElementById('sidebar-user2').innerHTML = "User: " + userUsername;
              document.getElementById('sidebar-user3').innerHTML = "User: " + userUsername;
              document.getElementById('sidebar-user4').innerHTML = "User: " + userUsername;
              document.getElementById('sidebar-user5').innerHTML = "User: " + userUsername;

              //Starts the homeLoad function which sorts the featured stocks
              homeLoad();
              return;

              //If the passwords did not match, then the else condition will be achieved; alerts them of incorrect input
          } else {
              //Alerts user that passwords do not match the Firebase
              document.querySelector('.unsuccessfulLoginAlert').style.display = 'block'

              //Then hides after 3 seconds
              setTimeout(function () {
                  document.querySelector('.unsuccessfulLoginAlert').style.display = 'none'
              }, 3000);
              return;

          }

          //If the username wasn't found in the Firebase after the binary search, it will alert the user
      } else {

          //Alerts user that the user does not exist
          document.querySelector('.emptyLoginAlert').style.display = 'block'

          //Then hides after 3 seconds
          setTimeout(function () {
              document.querySelector('.emptyLoginAlert').style.display = 'none'
          }, 3000);
          return;
      }

  }


  //Function for handling error data from the Firebase
  function errData(err) {
      console.log('Error!')
      console.log(err);
  }




  //Group of functions that hide every page except for the one the user clicked on
  function homeButton() {
      $(".page1").hide();
      $(".page2").show();
      $(".page3").hide();
      $(".page4").hide();
      $(".page5").hide();
      $(".stockPage").hide();
  }

  function searchButton() {
      $(".page1").hide();
      $(".page2").hide();
      $(".page3").show();
      $(".page4").hide();
      $(".page5").hide();
      $(".stockPage").hide();
      $(".stockPageButtonDiv").hide();

      //The search button page will reset the data of the stock page everytime it is pressed
      document.getElementById('toStockPage').innerHTML = "";
      document.getElementById('searchbarInput').value = "";
  }

  function portfolioButton() {
      $(".page1").hide();
      $(".page2").hide();
      $(".page3").hide();
      $(".page4").show();
      $(".page5").hide();
      $(".stockPage").hide();
  }

  function stocklistButton() {
      $(".page1").hide();
      $(".page2").hide();
      $(".page3").hide();
      $(".page4").hide();
      $(".page5").show();
      $(".stockPage").hide();
  }


  //Globally initializing the stock symbol input on the search page
  let stockSymbolInput;

  /* 
  On the search page, when the user types in a stock symbol and presses search, it will create a button that directs 
  the user to the specific stock page that they entered.
  */
  function searchbarButton() {

      //Makes sure that the stock symbol that was inputted is in uppercase so that the API can access it
      stockSymbolInput = getInputVal('searchbarInput').toUpperCase();

      //Shows the stock page 
      $(".stockPageButtonDiv").show();

      //Sets the title of the stock page to be the symbol entered
      document.getElementById('toStockPage').innerHTML = stockSymbolInput;
  }


  //Initializes the stock chart which later uses chart.js to form a chart of weekly data
  let stockInfoChart;

  //Global variables to set the stock page's table data whilst loading (essentially keeping the table cleared)
  let oldTitle = document.getElementById('stockPageInfoTitle').innerHTML;
  let oldHigh = document.getElementById('stockPageHigh').innerHTML;
  let oldLow = document.getElementById('stockPageLow').innerHTML;
  let oldOpen = document.getElementById('stockPageOpen').innerHTML;
  let oldClose = document.getElementById('stockPageClose').innerHTML;
  let oldChange = document.getElementById('stockPageChange').innerHTML;


  /*
  This button will take the user to the stock page of their entry, and will populate the table with daily data
  of high, low, close, open, and also the percentage change
  */
  function stockPageButton() {

      //Hides all pages except for the stock page
      $(".page1").hide();
      $(".page2").hide();
      $(".page3").hide();
      $(".page4").hide();
      $(".page5").hide();
      $(".stockPage").show();
      $(".stockPageButtonDiv").hide();


      //When the new data is loading, the table data will all be reverted to their original status of no data
      document.getElementById('stockPageInfoTitle').innerHTML = oldTitle;
      document.getElementById('stockPageHigh').innerHTML = oldHigh;
      document.getElementById('stockPageLow').innerHTML = oldLow;
      document.getElementById('stockPageOpen').innerHTML = oldOpen;
      document.getElementById('stockPageClose').innerHTML = oldClose;
      document.getElementById('stockPageChange').innerHTML = oldChange;

      let xhttp = new XMLHttpRequest;

      //Initializes the new data to be put into the daily data table
      let data;
      let high;
      let low;
      let open;
      let close;
      let trimmedLatestDate;

      //Sets the stock page subheading as the stock symbol that the user input
      document.getElementById('stockpageName').innerHTML = stockSymbolInput;

      //Making the request using the specific stock symbol provided and opening a new XMLHttpRequest
      let URL = api + stockSymbolInput + apiKey;
      xhttp.open('GET', URL, true);

      //Initializes chart.js chart for weekly stock data
      let stockChart = document.getElementById('stockChart').getContext('2d');

      //Upon receiving the API data, this function is executed
      xhttp.onload = function () {

          //Accesses JSON data here and gets the latest date
          data = JSON.parse(this.response);
          let latestDate = data['Meta Data']['3. Last Refreshed'];
          trimmedLatestDate = latestDate.substring(0, 10);

          //Fills the global variables of stock data points with live, daily data from the Alphavantage API
          high = data['Time Series (Daily)'][trimmedLatestDate]['2. high'];
          low = data['Time Series (Daily)'][trimmedLatestDate]['3. low'];
          open = data['Time Series (Daily)'][trimmedLatestDate]['1. open'];
          close = data['Time Series (Daily)'][trimmedLatestDate]['4. close'];

          //Calculates the percentage change of opening and closing values of the stock
          percentChange = Math.round(100 * ((parseFloat(close) - parseFloat(open)) / parseFloat(open)) * 100) / 100;

          //Fills the cells and rows in the data table with the data taken from the API
          document.getElementById('stockPageInfoTitle').innerHTML = "Daily Performance: " + stockSymbolInput + " at " + trimmedLatestDate;
          document.getElementById('stockPageHigh').innerHTML = high;
          document.getElementById('stockPageLow').innerHTML = low;
          document.getElementById('stockPageOpen').innerHTML = open;
          document.getElementById('stockPageClose').innerHTML = close;
          document.getElementById('stockPageChange').innerHTML = percentChange + "%";

          //Gets all the dates from the past 100 dates which will then be cut down to 5 (weekly) points later on
          let storageDates = [];
          for (var key in data['Time Series (Daily)']) {

              //Pushes the dates in the JSON data into the storageDates array
              storageDates.push(key);
          }

          //Limits the 100 day data points to just the past 5, as stock markets operate only on weekdays (5 days)
          let weekDates = [];
          for (i = 0; i < 5; i++) {
              weekDates.push(storageDates[i]);
          }

          //Reverses the week dates as the dates are given from newest to oldest
          weekDates = weekDates.reverse();

          //Initializes the closing price array for all the stocks
          let weekClose = []

          //For the 5 dates given, the closing price is taken from the JSON data
          for (i = 0; i < 5; i++) {

              //Populates the closing price array
              weekClose.push(data['Time Series (Daily)'][weekDates[i]]['4. close']);
          }

          //If the chart exists, delete any existing data, or else it causes a bug where the old data on the chart shows
          if (stockInfoChart) {
              stockInfoChart.destroy();
          }

          //This creates the chart with weekly stock data using the chart.js library
          stockInfoChart = new Chart(stockChart, {
              type: 'line',
              data: {
                  labels: weekDates,
                  label: 'Date',
                  datasets: [{
                      data: weekClose,
                      label: 'Value ($USD)',
                      backgroundColor: [
                          //Sets the colours for the chart
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 120, 44, 0.2)'
                      ],
                      borderColor: [
                          'rgba(255, 99, 132, 1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                          'rgba(255, 159, 64, 1)',
                          'rgba(255, 120, 44, 1)'
                      ],
                      borderWidth: 1
                  }]
              },
              options: {
                  title: {
                      display: true,
                      text: 'Week History'
                  },
                  elements: {
                      line: {
                          tension: 0 // disables bezier curves
                      }
                  }
              }

          });

      }

      xhttp.send();
  }