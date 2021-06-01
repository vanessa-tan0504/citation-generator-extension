$(document).ready(function () {
    //variables
    var settingButton = '.setting-button';

    var webExportBtn = "#website-export";
    var webCopyBtn = "#website-copy";
    var webPreview = "#website-preview";
    var webCiteList = "#website-list";
    var webClearBtn = "#website-clear"

    var journalExportBtn = "#journal-export";
    var journalCopyBtn = "#journal-copy";
    var journalPreview = "#journal-preview";
    var journalCiteList = "#journal-list";
    var journalClearBtn = "#journal-clear"

    var slideExportBtn = "#slideshow-export";
    var slideCopyBtn = "#slideshow-copy";
    var slidePreview = "#slideshow-preview";
    var slideCiteList = "#slideshow-list";
    var slideClearBtn = "#slideshow-clear"

    // Handle Citing
    $("#website-style, #website-fname, #website-lname, #website-page, #website-site, #website-date, #website-url").on('change input', function () {
        $("#website-preview").html(cite(1));
    });

    $("#journal-style, #journal-fname, #journal-lname, #journal-article, #journal-page, #journal-title, #journal-date, #journal-vol, #journal-issue, #journal-url").on('change input', function () {
        $("#journal-preview").html(cite(2));
    });

    $("#slideshow-style, #slideshow-fname, #slideshow-lname, #slideshow-title, #slideshow-site, #slideshow-date, #slideshow-url").on('change input', function () {
        $("#slideshow-preview").html(cite(3));
    });

    //--------------------------Setting--------------------------------------------------

    //setting button popout toggle
    $(settingButton).click(function (e) {
        e.preventDefault();
        if ($(this).hasClass('selected')) {
            $('.setting-dialog').slideFadeToggle(function (e) {
                $(settingButton).removeClass('selected');
            });

        } else {
            $(this).addClass('selected');
            $('.setting-dialog').slideFadeToggle();
        }
        return false;
    });

    //radio button to enable default / dark mode
    $("#setting-radio").change(function (e) {
        e.preventDefault();

        var selected_val = $("input[name='themeRadios']:checked").val();
        var element = document.body;

        if (selected_val == "2") {
            $(element).addClass('dark');

        } else if (selected_val == "1") {
            $(element).removeClass('dark');
        }
    });

    //--------------------------Website --------------------------------------------------

    // website add to citation list
    $("#website-form").submit(function (e) {
        //remove default submit function (reset form upon submit)
        e.preventDefault();

        //pass value into citation list
        var preview_val = $(webPreview).text();
        var existing_list = $(webCiteList).text();
        var list_new = existing_list.length<1 ? preview_val : existing_list + '\n\n' + preview_val;
        if(preview_val !== "Complete the required fields"){
            if(!is_duplicate(preview_val, existing_list)){
                $(webCiteList).text(list_new).trigger('focus');
            }
            else{
                browser.notifications.create('EzCitation', {
                    'type': 'basic',
                    'title': 'EzCitation',
                    'iconUrl': 'img/logo.png',
                    'message': 'Duplicated!'
                });
            }  
        }            
    });

    // disable website export & copy button if citation list is empty
    $(webExportBtn).attr('disabled', true);
    $(webCopyBtn).attr('disabled', true);
    $(webClearBtn).attr('disabled', true);

    $(webCiteList).focus(function (e) {
        e.preventDefault();
        var textarea_val = $(webCiteList).val();
        manageBtn(textarea_val, webExportBtn, webCopyBtn, webClearBtn);
    });

    // website export button function
    $(webExportBtn).click(function () {
        var list = $(webCiteList).val();
        exportToFile(list);
    });

    // website copy button function
    $(webCopyBtn).click(function () {
        var list = $(webCiteList).select();
        copyToClip(list);
    });

    // clear button
    $(webClearBtn).click(function(){
        webCiteList = clear_list($(webCiteList), $(webCopyBtn), $(webExportBtn), $(webClearBtn));
    });

    //--------------------------Journal --------------------------------------------------

    // journal add to citation list
    $("#journal-form").submit(function (e) {
        //remove default submit function (reset form upon submit)
        e.preventDefault();

        //pass value into citation list
        var preview_val = $(journalPreview).text();
        var existing_list = $(journalCiteList).text();
        var list_new = existing_list.length<1 ? preview_val : existing_list + '\n\n' + preview_val;
        if(preview_val !== "Complete the required fields"){
            if(!is_duplicate(preview_val, existing_list)){
                $(journalCiteList).text(list_new).trigger('focus');
            }
            else{
                browser.notifications.create('EzCitation', {
                    'type': 'basic',
                    'title': 'EzCitation',
                    'iconUrl': 'img/logo.png',
                    'message': 'Duplicated!'
                });
            }
        } 
    });

    // disable journal export & copy button if citation list is empty
    $(journalExportBtn).attr('disabled', true);
    $(journalCopyBtn).attr('disabled', true);
    $(journalClearBtn).attr('disabled', true);

    $(journalCiteList).focus(function (e) {
        e.preventDefault();
        var textarea_val = $(journalCiteList).val();
        manageBtn(textarea_val, journalExportBtn, journalCopyBtn, journalClearBtn);
    });

    // journal export button function
    $(journalExportBtn).click(function () {
        var list = $(journalCiteList).val();
        exportToFile(list);
    });

    // journal copy button function
    $(journalCopyBtn).click(function () {
        var list = $(journalCiteList).select();
        copyToClip(list);
    });

    // clear button
    $(journalClearBtn).click(function(){
        journalCiteList = clear_list($(journalCiteList), $(journalExportBtn), $(journalCopyBtn), $(journalClearBtn));
    });


    //function to enforce textbox accept numeric and hypen only (for page,vol & issue num)
    $('.number-only').keypress(function (e) {
        var charCode = (e.which) ? e.which : event.keyCode;

        if (String.fromCharCode(charCode).match(/[^0-9 -]/g))
            return false;
    });

    //--------------------------Slideshow --------------------------------------------------

    // slideshow add to citation list
    $("#slideshow-form").submit(function (e) {
        //remove default submit function (reset form upon submit)
        e.preventDefault();

        //pass value into citation list
        var preview_val = $(slidePreview).text();
        var existing_list = $(slideCiteList).text();
        var list_new = existing_list.length<1 ? preview_val : existing_list + '\n\n' + preview_val;
        if(preview_val !== "Complete the required fields"){
            if(!is_duplicate(preview_val, existing_list)){
                $(slideCiteList).text(list_new).trigger('focus');
            }
            else{
                browser.notifications.create('EzCitation', {
                    'type': 'basic',
                    'title': 'EzCitation',
                    'iconUrl': 'img/logo.png',
                    'message': 'Duplicated!'
                });
            }
        } 
    });

    // disable slideshow export & copy button if citation list is empty
    $(slideExportBtn).attr('disabled', true);
    $(slideCopyBtn).attr('disabled', true);
    $(slideClearBtn).attr('disabled', true);

    $(slideCiteList).focus(function (e) {
        e.preventDefault();
        var textarea_val = $(slideCiteList).val();
        manageBtn(textarea_val, slideExportBtn, slideCopyBtn, slideClearBtn);
    });

    // slideshow export button function
    $(slideExportBtn).click(function () {
        var list = $(slideCiteList).val();
        exportToFile(list);
    });

    // slideshow copy button function
    $(slideCopyBtn).click(function () {
        var list = $(slideCiteList).select();
        copyToClip(list);
    });

    // clear button
    $(slideClearBtn).click(function(){
        slideCiteList = clear_list($(slideCiteList), $(slideExportBtn), $(slideCopyBtn), $(slideClearBtn));
    });

});


// toggle buttons disable/enable
function manageBtn(txtarea_val, exportBtn, copyBtn, clearBtn) {
    if (txtarea_val != '') {
        $(exportBtn).attr('disabled', false);
        $(copyBtn).attr('disabled', false);
        $(clearBtn).attr('disabled', false);
    } else {
        $(exportBtn).attr('disabled', true);
        $(copyBtn).attr('disabled', true);
        $(clearBtn).attr('disabled', true);
    }
}

// export to txt file 
function exportToFile(list) {
    var element = document.createElement('a');
    element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(list);
    element.download = moment().format('YYYYMMDD') + '_EzCitation.txt';
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// copy to clipboard
function copyToClip(list) {
    list.select();
    var message = document.execCommand('copy');

    browser.notifications.create('EzCitation', {
        'type': 'basic',
        'title': 'EzCitation',
        'iconUrl': 'img/logo.png',
        'message': 'The citation list successfully copied to your clipboard!'
    });

    setTimeout(function () {
        browser.notifications.clear('EzCitation')
    }, 3000);

}

// setting dialogbox animation
$.fn.slideFadeToggle = function (easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};

//--------------------------------------Citation Funcs---------------------------------------
function cite(type){
    const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December", 
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
    var today = new Date();
    var cite_res = "Complete the required fields<br><br>";

    switch(type){
        case 1:
            return web_res(monthNames, today, cite_res);
        case 2:
            return journal_res(monthNames, today, cite_res);
        case 3:
            return slide_res(monthNames, today, cite_res);
        default:
    }
}

function web_res(monthNames, today, cite_res){
    var fname = document.getElementById("website-fname").value;
    var lname = document.getElementById("website-lname").value;
    var page_title = document.getElementById("website-page").value;
    var site_title = document.getElementById("website-site").value;
    var raw_date = document.getElementById("website-date").value;
    var date = new Date(raw_date);
    var url = document.getElementById("website-url").value;
    var style = document.getElementById("website-style").value;                

    if( ((fname.length>0 && lname.length>0) || site_title.length>0) 
        && page_title.length>0 && url.length>0 && !!date.valueOf() ){

        if(style.toLowerCase() === "harvard"){
            if(fname.length>0 && lname.length>0 && site_title.length>0){
                cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+'). '+page_title.italics()+' [Online]. '+site_title+'. '
                +'Available at: '+url+' (Accessed: '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+').';
            }
            else{
                cite_res = site_title+'. ('+date.getFullYear()+'). '+page_title.italics()+' [Online]. '+site_title+'. '
                +'Available at: '+url+' (Accessed: '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+').';
            }
        }
        else if(style.toLowerCase() === "apa"){
            if(fname.length>0 && site_title.length>0){
                cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+', '+monthNames[date.getMonth()]+' '+date.getDate()+') '+page_title+'. '+site_title.italics()
                +'. Retrieved from '+url;
            }
            else{
                cite_res = site_title+'. ('+date.getFullYear()+', '+monthNames[date.getMonth()]+' '+date.getDate()+') '+page_title+'. '+site_title.italics()
                +'. Retrieved from '+url;
            }                       
        }
        else if(style.toLowerCase() === "mla"){    
            if(fname.length>0 && site_title.length>0){                   
                cite_res = lname+', '+fname+'. "'+page_title+'". '+site_title.italics()+". "+date.getDate()+' '+monthNames[date.getMonth()+12]+'. '+date.getFullYear()
                +': '+url+'. ';
            }
            else{
                cite_res = site_title+'. "'+page_title+'". '+site_title.italics()+". "+date.getDate()+' '+monthNames[date.getMonth()+12]+'. '+date.getFullYear()
                +': '+url+'. ';
            }
        }
        else{
            return cite_res;
        }

        return cite_res;
    }
    else{
        return cite_res;
    }
}

function journal_res(monthNames, today, cite_res){
    var fname = document.getElementById("journal-fname").value;
    var lname = document.getElementById("journal-lname").value;
    var article = document.getElementById("journal-article").value;
    var page = document.getElementById("journal-page").value;
    var journal = document.getElementById("journal-title").value;
    var raw_date = document.getElementById("journal-date").value;
    var volume = document.getElementById("journal-vol").value;
    var issue = document.getElementById("journal-issue").value;
    var date = new Date(raw_date);
    var url = document.getElementById("journal-url").value;
    var style = document.getElementById("journal-style").value;                

    if(fname.length>0 && lname.length>0 && article.length>0 && page.length>0 
        && journal.length>0 && !!date.valueOf()&& volume.length>0 && issue.length>0 && url.length>0){

        if(style.toLowerCase() === "harvard"){
            if(url.includes("http")){
                cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+') \''+article+'\', '+journal.italics()+', '+volume+'('+issue+'), '+page
                +'. [Online] Available at: '+url+' (Accessed: '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+').';   
            }
            else{
                cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+') \''+article+'\', '+journal.italics()+', '+volume+'('+issue+'), pp. '+page
                +'. [Online] DOI: '+url+' (Accessed: '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+').'; 
            }                            
        }
        else if(style.toLowerCase() === "apa"){
            cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+'). '+article+'. '+journal.italics()+', '+volume+'('+issue+'), '+page+'. '
            +url;
        }
        else if(style.toLowerCase() === "mla"){
            cite_res = fname+' '+lname+'. "'+article+'." '+journal.italics()+', '+date.getDate()+' '+monthNames[date.getMonth()+12]+'. '+date.getFullYear()
            +', pp. '+page+'.';
        }
        else{
            return cite_res;
        }

        return cite_res;
    }
    else{
        return cite_res;
    }
}

function slide_res(monthNames, today, cite_res){
    var fname = document.getElementById("slideshow-fname").value;
    var lname = document.getElementById("slideshow-lname").value;
    var title = document.getElementById("slideshow-title").value;
    var site = document.getElementById("slideshow-site").value;
    var raw_date = document.getElementById("slideshow-date").value;
    var date = new Date(raw_date);
    var url = document.getElementById("slideshow-url").value;
    var style = document.getElementById("slideshow-style").value;                

    if(fname.length>0 && lname.length>0 && title.length>0 && site.length>0 
        && !!date.valueOf() && url.length>0){

        if(style.toLowerCase() === "harvard"){
            cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+'). \''+title+'\' '+'[PowerPoint presentation]. '+site.italics()+'. Available at: '
            +url+' (Accessed: '+today.getDate()+' '+monthNames[today.getMonth()]+' '+today.getFullYear()+').';                                         
        }
        else if(style.toLowerCase() === "apa"){
            cite_res = lname+', '+handle_mul_names(fname)+'('+date.getFullYear()+'). '+title.italics()+' [PowerPoint slides]. '+site
            +'. '+url;
        }
        else if(style.toLowerCase() === "mla"){
            cite_res = lname+', '+fname+'. "'+title+'." '+site.italics()+', '+date.getDate()+' '+monthNames[date.getMonth()+12]+'. '+date.getFullYear()
            +', '+url+'. ';
        }
        else{
            return cite_res;
        }

        return cite_res;
    }
    else{
        return cite_res;
    }
}

function handle_mul_names(name){
    var result = "";
    if(name.includes(' ')){
        var all_initial = name.split(' ');
        for(var i=0; i<all_initial.length; i++){
            result += all_initial[i].charAt(0) + '. ';
        }
        return result;
    }
    else{
        return name.charAt(0) + '. ';
    }
}

function is_duplicate(preview_val, existing_list){
    var all_from_list = existing_list.split('\n');
    for(var i=0; i<all_from_list.length; i++){
        if(all_from_list[i] === preview_val){
            return true;
        }
    }
    return false;
}

function clear_list(the_list, exp_btn, cpy_btn, clear_btn){
    var result = window.confirm("Are you sure you want to clear the entire list?");
    if(result){
        the_list.text("");
        manageBtn(the_list.val(),exp_btn,cpy_btn,clear_btn);
        return the_list;
    }
}