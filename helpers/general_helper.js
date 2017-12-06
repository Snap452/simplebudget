'use strict';

exports.GenerateMenu = (path) => {
  var menu = {
    Home: '/',
    Transactions: {
      View: '/transactions',
      Add: '/transactions/add'
    },
    Goals: {
      View: '/goals',
      Add: '/goals/add'
    }
  };
  var menu_html = '<nav id="main-nav"><ul>';
  for (let key in menu) {
    if (typeof menu[key] === 'object') {
      // We have sub-menus
      menu_html += `<li class="dropdown ${(path === key) ? 'active': ''}">
                          <a href="${menu[key][Object.keys(menu[key])[0]]}">${key}</a>
                          <div class="dropdown-content">`;
      for (let subKey in menu[key]) {
        menu_html += `<a href="${menu[key][subKey]}">${subKey}</a>`;
      }
      menu.html += '</div></li>';
    }
    else {
      // No sub-menus
      menu_html += `<li${(path === key) ? ' class="active"': ''}><a href="${menu[key]}">${key}</a></li>`;
    }
  }

  return menu_html + '</ul></nav>';
};

exports.FormValue = (val) => {
  if (val) {
    return `value="${val}"`;
  }
  else {
    return '';
  }
};