document.addEventListener("DOMContentLoaded", () => {
    const target = window.location.hash.replace("#", "");
  
    const copyFunction = () => {
      const linkElement = document.getElementById("getlink");
      const copyNotification = document.getElementById("LinkCopy");
  
      linkElement.style.display = "inline-block";
      linkElement.select();
      document.execCommand("copy");
      linkElement.style.display = "none";
      copyNotification.classList.add("copied");
      
      setTimeout(() => copyNotification.classList.remove("copied"), 3000);
    };
  
    const parseShortcode = (str, key) => {
      const segments = str.split("$");
      for (const segment of segments) {
        const [shortcodeKey, value] = segment.split("=");
        if (shortcodeKey.trim() === key) {
          const matches = value.match(/[^{\}]+(?=})/g);
          if (matches) return matches[0].trim();
        }
      }
      return false;
    };
  
    const createErrorMessage = () => '<span class="error-msg"><b>Error:</b>&nbsp;No Results Found</span>';
    const createLoader = () => '<div class="loader"></div>';
  
    const getFeedUrl = (type, count, label) => {
      switch (label) {
        case "recent":
          return `/feeds/posts/default?alt=json&max-results=${count}`;
        case "comments":
          return `/feeds/comments/default?alt=json&max-results=${count}`;
        default:
          return `/feeds/posts/default/-/${label}?alt=json&max-results=${count}`;
      }
    };
  
    const getPostLink = (entry) => entry.link.find(link => link.rel === "alternate").href;
  
    const getPostTitle = (entry) => entry.title.$t || 'No Title';
  
    const getPostTag = (entry) => entry.category ? `<span class="entry-category">${entry.category[0].term}</span>` : '';
  
    const getPostAuthor = (entry) => {
      if (!entry.author) return '';
      const authorName = entry.author[0].name.$t;
      return `<span class="entry-author mi"><span class="sp">Author:</span><span class="author-name">${authorName}</span></span>`;
    };
  
    const formatDate = (publishedDate) => {
      const date = new Date(publishedDate);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
  
    const getPostDate = (entry) => {
      const publishedDate = entry.published.$t;
      const formattedDate = formatDate(publishedDate);
      return `<span class="entry-time mi"><time class="published" datetime="${publishedDate}">${formattedDate}</time></span>`;
    };
  
    const getPostMeta = (authorHtml, dateHtml, entry) => {
      const commentCount = entry.thr$total ? `<span class="cmt-count">${entry.thr$total.$t}</span>` : '';
      return `<div class="entry-meta">${authorHtml}${dateHtml}${commentCount}</div>`;
    };
  
    const getFirstImage = (content) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const imgElement = tempDiv.querySelector('img');
      return imgElement ? imgElement.src : 'https://resources.blogblog.com/img/blank.gif';
    };
  
    const getPostImage = (entry) => {
      const content = entry.content ? entry.content.$t : '';
      const thumbnail = entry.media$thumbnail ? entry.media$thumbnail.url : 'https://resources.blogblog.com/img/blank.gif';
      if (content.includes('<iframe') && content.includes('www.youtube.com')) {
        return thumbnail.replace("img.youtube.com", "i.ytimg.com").replace("/default.", "/maxresdefault.");
      }
      return content.includes('<img') ? getFirstImage(content) : thumbnail;
    };
  
    const getPostImageType = (imageUrl) => imageUrl.includes('i.ytimg.com') ? 'is-video' : 'is-image';
  
    const getPostSummary = (entry, length) => {
      const content = entry.content ? entry.content.$t : '';
      const textContent = document.createElement('div').innerHTML = content;
      return `<span class="entry-excerpt excerpt">${textContent.trim().substr(0, length)}…</span>`;
    };
  
    const getPostComments = (entry, postUrl) => {
      const authorName = entry.author[0].name.$t;
      const avatarUrl = entry.author[0].gd$image.src.replace("/s113", "/s72-c").replace("/s220", "/s72-c");
      const title = entry.title.$t;
      return `<div class="cmm1-item"><a class="entry-inner wrap-all-link" href="${postUrl}" title="${authorName}">
        <span class="entry-image-wrap cmm-avatar"><span class="entry-thumb" data-image="${avatarUrl}"></span></span>
        <div class="entry-header"><h2 class="entry-title cmm-title">${authorName}</h2><p class="cmm-snippet excerpt">${title}</p></div>
      </a></div>`;
    };
  
    const handleAjaxResponse = (type, data) => {
      const entries = data.feed.entry || [];
      if (!entries.length) return createErrorMessage();
  
      let content = '';
      switch (type) {
        case 'msimple':
          content = '<div class="ul mega-items">';
          break;
        case 'ticker':
          content = '<div class="ticker-items">';
          break;
        case 'featured':
          content = '<div class="featured-items">';
          break;
        case 'block':
        case 'grid':
        case 'list':
        case 'video':
          content = `<div class="content-block ${type}-items">`;
          break;
        case 'comments':
          content = '<div class="cmm1-items">';
          break;
        case 'related':
          content = '<div class="related-posts">';
          break;
        default:
          content = '<div class="default-items">';
      }
  
      entries.forEach((entry, index) => {
        const postUrl = getPostLink(entry);
        const title = getPostTitle(entry);
        const tagHtml = getPostTag(entry);
        const authorHtml = getPostAuthor(entry);
        const dateHtml = getPostDate(entry);
        const imageUrl = getPostImage(entry);
        const imageType = getPostImageType(imageUrl);
        const metaHtml = getPostMeta(authorHtml, dateHtml, entry);
  
        let itemHtml = '';
        switch (type) {
          case 'msimple':
            itemHtml = `<div class="mega-item post"><a title="${title}" class="entry-image-wrap ${imageType}" href="${postUrl}"><svg class="entry-thumb" viewBox="0 0 16 9" data-image="${imageUrl}"/></a><h2 class="entry-title"><a href="${postUrl}" title="${title}">${title}</a></h2>${metaHtml}</div>`;
            break;
          case 'ticker':
            itemHtml = `<div class="ticker-item"><h2 class="entry-title"><a href="${postUrl}" title="${title}">${title}</a></h2></div>`;
            break;
          case 'featured':
            itemHtml = `<div class="featured-item post"><a title="${title}" class="entry-image-wrap ${imageType}" href="${postUrl}"><svg class="entry-thumb" viewBox="0 0 16 9" data-image="${imageUrl}"/></a><div class="entry-header">${tagHtml}<h2 class="entry-title"><a href="${postUrl}" title="${title}">${title}</a></h2>${metaHtml}</div></div>`;
            break;
          // Add more cases for other types...
          default:
            itemHtml = `<div class="default-item"><a href="${postUrl}" title="${title}">${title}</a></div>`;
        }
  
        content += itemHtml;
      });
  
      content += '</div>';
      return content;
    };
  
    const fetchFeedData = async (url, type) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return handleAjaxResponse(type, data);
      } catch (error) {
        console.error('Error fetching feed data:', error);
        return createErrorMessage();
      }
    };
  
    const initWidget = (element, type, feedLabel, postCount) => {
      const feedUrl = getFeedUrl(type, postCount, feedLabel);
      const loaderHtml = createLoader();
      element.innerHTML = loaderHtml;
  
      fetchFeedData(feedUrl, type).then(content => {
        element.innerHTML = content;
        // Add any additional initialization logic if needed...
      });
    };
  
    document.querySelectorAll('.widget').forEach(widget => {
      const type = widget.getAttribute('data-type');
      const feedLabel = widget.getAttribute('data-label');
      const postCount = parseInt(widget.getAttribute('data-count'), 10);
      initWidget(widget, type, feedLabel, postCount);
    });
  
    // Additional event listeners and initialization logic...
  });
  