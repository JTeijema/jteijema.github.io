(function ($, undefined) {
  var featured = [],
    exclude = [],
    categories = {
      'ASReview': {
        'asreview': null,
        'asreview-plugin-model-cnn-17-layer': null,
        'asreview-study-model-switching': null,
        'template-extension-new-dataset': null,
        'template-extension-new-model': null,
        'asreview-visualization': null,
        'asreview-XGBoost': null,
        'asreview-artwork': null,
        'asreview-wordcloud': null,
        'asreview-plugin-wide-doc2vec': null,
        'asreview-plugin-model-switcher': null
      },
      'Websites': {
        'Teije.ma': null,
        'jteijema.github.io': null,
        'EU-Alternative': null
      },
      'Other': {
      },
    },
    num = 0;

  function addRecentlyUpdatedRepo(repo) {
    var $item = $('<li>');
    var $name = $('<a>').attr('href', repo.html_url).text(repo.name);
    $item.append($('<span>').addClass('name').append($name));
    $item.append('<span class="bullet">&sdot;</span>');
    var $time = $('<a>').attr('href', repo.html_url + '/commits').text( repo.pushed_at.toDateString() );
    $item.append($('<span>').addClass('time').append($time));
    $item.append('<span class="bullet">&sdot;</span>');
    var $watchers = $('<a>').attr('href', repo.html_url + '/watchers').text(repo.watchers + (repo.watchers === 1 ? ' watcher' : ' watchers'));
    $item.append($('<span>').addClass('watchers').append($watchers));
    $item.append('<span class="bullet">&sdot;</span>');
    var $forks = $('<a>').attr('href', repo.html_url + '/network').text(repo.forks + (repo.forks === 1 ? ' fork' : ' forks'));
    $item.append($('<span>').addClass('forks').append($forks));
    $('#recently-updated').removeClass('loading').append($item);
  }

  function addRepo(repo, $container) {
    var $item = $('<div>').addClass('column');
    var $link = $('<a>').attr('href', repo.html_url).appendTo($item);
    $link.addClass('repo lang-'+ (repo.language || '').toLowerCase().replace(/[\+#]/gi, '') );
    $link.append($('<h4 class="repo-name">').text(repo.name || 'Unknown'));
    $link.append($('<h5 class="repo-lang">').text(repo.language || ''));
    $link.append($('<p class="repo-desc">').text(repo.description || ''));

    if( featured.indexOf(repo.name) > -1 ){
      $link.addClass('featured'+(++num));
      $item.prependTo('#repos');
    }else{
    $item.appendTo($container);
    }
  }

  function addCategory(cat, repos){
    var $section = $('<section id="cat-'+cat+'" />').appendTo('#repos'), $container;
    $section.append($('<h2 />',{'class': 'subheadline', 'text': cat}));
    $container = $('<div class="repos section columns three" />').appendTo($section);

    $('#category-shortcuts').append($('<a />', {
      href: '#cat-'+cat,
      text: cat,
      class: 'category-shortcuts'
    }))

    $.each(repos, function(i, repo){
      if( repo !== null ){
        addRepo(repo, $container);
      }
    });
  }

  function addRepos(repos, page) {
    repos = [];
    var uri = 'https://api.github.com/users/jteijema/repos';

    $.getJSON(uri, function (result) {

      repos = $.grep(result.data, function(value) {
        var keep = exclude.indexOf(value.name) === -1,
          found = false;

        // Build up the categories while we're looping through
        if( keep ){
          $.each(categories, function(key, items){
            if( value.name in items ){
              found = true;
              items[value.name] = value;
              return false;
            }else if( value.language == key ){
              found = true;
              categories[key][value.name] = value;
            }
          });

          if( !found ){
            categories.Other[value.name] = value;
          }
        }

        return keep;
      });

      $('#repo-headline').hide();//text(repos.length).removeClass('loading');
      // Convert pushed_at to Date.
      $.each(repos, function (i, repo) {
        repo.pushed_at = new Date(repo.pushed_at || null);
      });

      // Sort by most-recently pushed to.
      // or is featured
      repos.sort(function (a, b) {
        if (a.pushed_at < b.pushed_at) return 1;
        if (b.pushed_at < a.pushed_at) return -1;
        return 0;
      });

      $.each(repos.slice(0, 3), function (i, repo) {
        addRecentlyUpdatedRepo(repo);
      });

      $.each(categories, function (cat, repos){
        addCategory(cat, repos);
      });
    });
  }

  // function addMember( member ){
  //   var $item = $('<div>').addClass('column');
  //   var $link = $('<a>').attr('href', member.html_url).appendTo($item);
  //   var $deets = $('<div>').addClass('member-info').appendTo($link);
  //   $link.addClass('member');
  //   $link.prepend($('<img height="90" width="90">').attr('src', member.avatar_url).addClass('member-avatar'));
  //   $deets.append( $('<h4 class="user-name">').text(member.login));
  //   $item.appendTo('#members');
  // }

  // function addMembers(){
  //   $.getJSON('https://api.github.com/users/jteijema/members?callback=?', function (result) {
  //     // API Rate limiting catch
  //     if( result.data && result.data.message ){ return; }

  //     var members = result.data;
  //     $('#member-count').text(members.length).removeClass('loading');
  //     $.each( members, function(idx, member){ addMember( member ); });
  //   });
  // }

  addRepos();
  // addMembers();

  $('#activate-mobile-menu').on('click', function( evt ){
    evt.preventDefault();
    $('#header').toggleClass('mobile-menu-active');
  })

})(jQuery);
