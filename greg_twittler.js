var runOnOpen = function () {
  
  window.index = 0;
  
  outputNewTweets();
  window.updateId = window.setInterval(outputNewTweets,1000);
  
  //Makes the "send tweets" section work
  $('#my-username').on('propertychange keyup input paste',function() {
    window.visitor = $(this).val();
    
    //Only enables the send tweet section if
    //a username has been entered
    if(window.visitor !== '') {
      $('.my-message').prop("disabled",false);
    } else {
      $('.my-message').prop("disabled",true);
    }
  });
  
  $('.my-message').last().on('click',sendUserTweet);
};

var outputNewTweets = function () {
  var tweets = streams.home;
  var $tweet_ul = $('ul.tweets');
  
  //adds new tweets
  while (index < streams.home.length) {
    var tweet = streams.home[index];
    
    outputTweet(tweet, $tweet_ul)
    index++;
  }
  
  //deletes old tweets
  var max_tweets = 10;
  var visible_tweets = $tweet_ul.children('li');
  visible_tweets.slice(max_tweets).remove();
  
  //Adds onclick event for all tweets
  $('ul.tweets').find('li').on('click','a',outputUserTimeline);
  
};

var outputTweet = function (tweet, $location) {
  $location.prepend("<li><a href='#')'>@" + tweet.user + "</a>: " 
      + tweet.message + " <span>[" + moment(tweet.created_at).fromNow() + "]</span></li>");
};

var outputUserTimeline = function (event) {
  //Prevents following the link
  event.preventDefault();
  
  //Pulls out the username
  var username = $(this).text().slice(1);
  
  //Gets all tweets for that user
  user_tweets = streams.users[username];
  
  //Deletes all current user tweets
  var $user_ul = $('ul.user');
  $user_ul.children('li').remove();
  
  //Adds all tweets for given user
  for (var i=0; i<user_tweets.length; i++) {
    outputTweet(user_tweets[i], $user_ul);
  }
  
};

var sendUserTweet = function (event) {
  if (! (window.visitor in streams.users) ) {
    streams.users[visitor] = [];
  }
  writeTweet( $('.my-message').first().val() );
};