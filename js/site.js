// Test URLs.  Not used in actual deployment
var target_url1 = "https://aaronparecki.com/2018/06/30/11/your-first-webmention";
var target_url2 = "https://indieweb.org";
var target_url3 = "https://orangemoose.com";

// Webmention API access points (and filter)
var count_url   = "https://webmention.io/api/count.json?target=";
var mention_url = "https://webmention.io/api/mentions.jf2?target=";
var mfilter = "&wm-property=in-reply-to";

// Called once the page is loaded to do any setup
document.addEventListener('DOMContentLoaded',function() {

    /*  Called via in-line <script> in HTML but here for reference. Note index #
    fetch(count_url+target_url)
      .then(response => {return(response.text());})
      .then(myJson => {showCounts(index,JSON.parse(myJson));});
    */

},false);

/*
 * Display counters of webmentions.  Types of webmentions
 * that might occur are:
 *   -) Likes
 *   -) Replies
 *   -) Mentions (links back to the target post)
 *   -) Bookmarks
 *   -) Reposts
 *   -) RSVP (which could be rsvp-yes, rsvp-no, rsvp-maybe)
 *
 * Index number scheme is used to allow multiple mention displays
 * on the same HTML page as might be the case for a combined ist of 
 * otherwise separate posts.
 */
function showCounts(index, data) {

    // If no webmentions of any kind then just return
    if(data.count == 0) return;

    // A container <div> was created in the HTML, keyed with an index #
    var m_div = document.getElementById("wm_sum"+index);

    // We put a <ul> in that to display our webmention counts
    var m_icons = document.createElement("UL");
    m_icons.setAttribute('class','menicons');
    m_div.appendChild(m_icons);

    // If any likes, display them using the 'star_border' icon
    if(data.type.like) {
        var li = document.createElement("LI");
        li.setAttribute('class','micon');
        li.innerHTML = 
        '<i class="material-icons md-18">star_border</i>&nbsp;' + data.type.like +
        '<span class="miconlabel">&nbsp;likes</span>';
        m_icons.appendChild(li);
    }

    // If any replies, display them using the 'chat_bubble_outline' icon
    if(data.type.reply) {
        var li = document.createElement("LI");
        li.setAttribute('class','micon');
        li.innerHTML = 
        '<i class="material-icons md-18">chat_bubble_outline</i>&nbsp;' + 
        data.type.reply + '<span class="miconlabel">&nbsp;replies</span>';
        m_icons.appendChild(li);
    }

    // If any reposts, display them using the 'repeat' icon (media)
    if(data.type.repost) {
        var li = document.createElement("LI");
        li.setAttribute('class','micon');
        li.innerHTML = 
        '<i class="material-icons md-18">repeat</i>&nbsp;' + 
        data.type.repost + '<span class="miconlabel">&nbsp;reposts</span>';
        m_icons.appendChild(li);
    }

    // If any mentions, display them using the 'description' outlined icon
    if(data.type.mention) {
        var li = document.createElement("LI");
        li.setAttribute('class','micon');
        li.innerHTML = 
        '<i class="material-icons-outlined md-18">description</i>&nbsp;' + 
        data.type.mention + '<span class="miconlabel">&nbsp;mentions</span>';
        m_icons.appendChild(li);
    }

    // If any bookmarks, display them using the 'bookmark_border' icon
    if(data.type.bookmark) {
        var li = document.createElement("LI");
        li.setAttribute('class','micon');
        li.innerHTML = 
        '<i class="material-icons md-18">bookmark_border</i>&nbsp;' + 
        data.type.bookmark + '<span class="miconlabel">&nbsp;bookmarks</span>';
        m_icons.appendChild(li);
    }

    if(data.type.rsvp) {
        var li = document.createElement("LI");
        li.setAttribute('class','micon');
        li.innerHTML = 
        '<i class="material-icons md-18">event</i>&nbsp;' + 
        data.type.rsvp + '<span class="miconlabel">&nbsp;RSVPs</span>';
        m_icons.appendChild(li);
    }
}