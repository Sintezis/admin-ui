(function(){
  'use strict'

  angular
    .module("adminClient")
    .factory('dummyData', dummyData)

  function dummyData($http, $filter, $log) {    
    var services = {  
      articles:       getArticles,
      article:        getArticle,
      deleteArticle:  deleteArticle,
      saveArticle:    saveArticle,
      pages:          getPages,
      page:           getPage,
      deletePage:     deletePage,
      savePage:       savePage,
      users:          getUsers,
      user:           getUser,
      saveUser:       saveUser,
      deleteUser:     deleteUser,
      settings:       settings,
      removeLanguage: removeLanguage,
      addLanguage:    addLanguage
    }

    var staticData = {
      settings: {
        title: "Homepage.com",
        header: "/path/to/header.img.png",
        languages: [
          {
            code: 'en',
            name: 'English'
          },
          {
            code: 'ger',
            name: 'German'
          },
          {
            code: 'cro',
            name: 'Croatian'
          }
        ]
      },
      articles:  [
        {
          id:        12,
          title:     "Wellcome",
          content:   "Some test Content 1", 
          author:    "Simun Strukan",
          date:      "21.09.2015, 18:35",
          page:      "Home",
          published: true
        },
        {
          id:        23,
          title:     "Who we are?",
          content:   "Some test Content 1", 
          author:    "Simun Strukan",
          date:      "21.10.2015, 09:00",
          page:      "About",
          published: false
        },
        {
          id:        10,
          title:     "Where we are?",
          content:   "Some test Content 1",
          author:    "Simun Strukan",
          date:      "21.10.2015, 12:00",
          page:      "Contact",
          published: false
        },
        {
          id:        11,
          title:     "About our company",
          content:   "Some test Content 1",
          author:    "Simun Strukan",
          date:      "21.13.2015, 12:45",
          page:      "Impressum",
          published: false
        }
      ],
      pages: [
        { 
          id:     1,
          title:  "Home",
          author: "Simun Strukan",
          date:   "21.09.2015, 12:45",
          articlesCount: 1,
          published: true,
          subPages: []
        },
        {
          id:     2,
          title:  "About",
          author: "Simun Strukan",
          date:   "21.09.2015, 13:00",
          articlesCount: 1,
          published: true,
          subPages: []
        },
        {
          id:     3,
          title:  "Contact",
          author: "Simun Strukan",
          date:   "21.09.2015, 13:15",
          articlesCount: 1,
          published: false,
          subPages: []
        },
        {
          id:     4,
          title:  "Impressum",
          author: "Simun Strukan",
          date:   "21.09.2015, 13:45",
          articlesCount: 1,
          published: false,
          subPages: []
        },
      ],
      users:     [
        { 
          id: 1,
          firstName: "Simun",
          lastName: "Strukan",
          email: "simun.strukan@gmail.com",
          secondaryEmail: "simun@manifestmedia.uk",
          role: "Admin",
          status: 1
        },
        { 
          id: 12,
          firstName: "Dario",
          lastName: "Molinari",
          email: "dario@manifestmedia.uk",
          secondaryEmail: "dario.molinari@gmail.com",
          role: "Admin",
          status: 1
        }
      ],
    }

    return services

    // ARTICLES

    function getArticles() {
      return staticData.articles
    }

    function getArticle(id) {
      return $filter('filter')(staticData.articles, {id: id})[0];
    }

    function deleteArticle(id, deleted) { 
      var article = getArticle(id)
      var index = staticData.articles.indexOf(article)
      staticData.articles.splice(index, 1)
      deleted(staticData.articles) 
    }

    function saveArticle(data, id, saved, error) {
      if(data.title == null){
        error({msg: "Please enter post title, before saving!"})
        return 
      }
      
      if (data.page == null) {
        error({msg: "Please select a page for this article!"})
        return 
      }

      var articleData = {  
        title:     data.title,
        content:   data.content,
        page:      data.page,
        author:    "Simun Strukan",
        date:      moment().format('MMMM Do YYYY, h:mm:ss'),
        published: false
      }
      
      if (id == null) {
        var id = Math.max.apply(this,$.map(staticData.articles, function(article){ return article.id; }));
        id++
        articleData["id"] = id
        staticData.articles.push(articleData)
      }
      else {
        var article     = getArticle(id)
        var index       = staticData.articles.indexOf(article)
        article.title   = data.title
        article.content = data.content
        article.page    = data.page
        staticData.articles[index] = article
      }
      saved(staticData.articles)
    }

    // PAGES

    function getPages() {
      return staticData.pages
    }

    function getPage(id) {
      var filteredPage
      var search = function(array, id) {
        var page = $filter('filter')(array, {id: id})[0];
        if (page != undefined) {
          filteredPage = page
        }
        else {
          for (var i = 0; i <= array.length - 1; i++) {
            if (Array.isArray(array[i].subPages) && array[i].subPages.length > 0) {
              search(array[i].subPages, id)
            }
          };  
        }
      }

      search(staticData.pages, id)
      return filteredPage
    }

    function deletePage(id, deleted) {
      var page = getPage(id)
      
      var search = function(array, obj){
        var index = array.indexOf(obj)
        if(index != -1){
          array.splice(index, 1)
        }
        else {
          for (var i = 0; i <= array.length - 1; i++) {
            if (Array.isArray(array[i].subPages) && array[i].subPages.length > 0) {
              search(array[i].subPages, obj)
            }  
          };
        } 
      }
      search(staticData.pages, page)
      deleted(staticData.pages)
    }

    function savePage(data, id, saved, error) {

      if(data.title == null){
        error({msg: "Please enter page title, before saving"})
        return
      }

      if (id == null) {
        var id = Math.max.apply(this,$.map(staticData.pages, function(page){ return page.id; }));
        id++
        var pageData = {
          id: id,
          title: data.title,
          author: "Simun Strukan",
          date:   moment().format('DD.MM.YYYY, HH:mm'),
          published: false,
          articlesCount: 0
        }
        staticData.pages.push(pageData)   
      }
      else{
        var page = getPage(id)
        var index = staticData.pages.indexOf(page)
        page.title = data.title
        staticData.pages[index] = page
      }
      
      saved(staticData.pages)
    }

    // USERS

    function getUsers() {
      return staticData.users
    }

    function getUser(id) {
      return $filter('filter')(staticData.users, {id: id})[0];
    }

    function saveUser(data, id, saved, error) {
      if (data.password != null && data.passwordConfirm != null){
        if (data.password.length > 0 && data.passwordConfirm.length > 0) {
          if(data.password != data.passwordConfirm){
            error({msg: "Passwords do not match!"})
            return
          }
        }  
      }
      
      if (id == null) {
        var id = Math.max.apply(this,$.map(staticData.pages, function(page){ return page.id; }));
        id++
        var userData = {
          id: id,
          firstName:      data.firstName,
          lastName:       data.lastName,
          email:          data.email,
          secondaryEmail: data.secondaryEmail,
          role: "Admin",
          status: 1
        }
        staticData.users.push(userData)
      }
      else {
        
        var user  = getUser(id)
        var index = staticData.users.indexOf(user) 
        user.firstName = data.firstName
        user.lastName = data.lastName
        user.email = data.email
        user.secondaryEmail = data.secondaryEmail
        staticData.users[index] = user

      }
      saved(staticData.users[index])
    }

    function deleteUser(id, deleted, error) {
      var user = getUser(id)
      var index = staticData.users.indexOf(user)
      staticData.users.splice(index, 1)
      deleted(staticData.users) 
    }

    function settings() { 
      return staticData.settings
    }

    function addLanguage(code, added, error) {
      $http
        .get('app/common/languages/languages.json')
        .success(function(response){
          var commonLanguages = response
          var language = $filter('filter')(commonLanguages, {code: code})[0];
          staticData.settings.languages.push(language)
          added(staticData.settings.languages)
        })
      
    }

    function removeLanguage(lang, deleted, error){
      var index = staticData.settings.languages.indexOf(lang)
      staticData.settings.languages.splice(index, 1)
      deleted(staticData.settings.languages)

    }

  }

})()
