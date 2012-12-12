// Generated by CoffeeScript 1.4.0
(function() {
  var Card, CardUsage, Deck, locale,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  locale = 'zh';

  Card = (function(_super) {

    __extends(Card, _super);

    function Card() {
      return Card.__super__.constructor.apply(this, arguments);
    }

    Card.types = ['Warrior', 'Spellcaster', 'Fairy', 'Fiend', 'Zombie', 'Machine', 'Aqua', 'Pyro', 'Rock', 'Winged_Beast', 'Plant', 'Insect', 'Thunder', 'Dragon', 'Beast', 'Beast-Warrior', 'Dinosaur', 'Fish', 'Sea_Serpent', 'Reptile', 'Psychic', 'Divine-Beast', 'Creator_God'];

    Card._attributes = ['EARTH', 'WATER', 'FIRE', 'WIND', 'LIGHT', 'DARK', 'DIVINE'];

    Card.card_types = ['Monster', 'Spell', 'Trap', null, 'Normal', 'Effect', 'Fusion', 'Ritual', null, 'Spirit', 'Union', 'Gemini', 'Tuner', 'Synchro', null, null, 'Quick-Play', 'Continuous', 'Equip', 'Field', 'Counter', 'Flip', 'Toon', 'Xyz'];

    Card.categories = ['Monster', 'Spell', 'Trap'];

    Card.card_types_extra = ['Fusion', 'Synchro', 'Xyz'];

    Card.configure('Card', 'id', 'name', 'card_type', 'type', 'attribute', 'level', 'atk', 'def', 'description');

    Card.extend(Spine.Model.Local);

    Card.extend(Spine.Events);

    Card.hasMany('card_usages', CardUsage);

    Card.url = "http://my-card.in/cards";

    Card.locale_url = "http://my-card.in/cards_" + locale;

    Card.prototype.image_url = function() {
      return "http://my-card.in/images/cards/ygocore/" + this.id + ".jpg";
    };

    Card.prototype.image_thumbnail_url = function() {
      return "http://my-card.in/images/cards/ygocore/thumbnail/" + this.id + ".jpg";
    };

    Card.fetch_by_name = function(name, callback) {
      var _this = this;
      return $.getJSON("" + this.locale_url + "?q=" + (JSON.stringify({
        name: {
          $regex: name.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1'),
          $options: 'i'
        }
      })), function(langs) {
        return alert(langs);
      });
    };

    Card.query = function(q, callback) {
      var _this = this;
      return $.getJSON("" + this.url + "?q=" + (JSON.stringify(q)), function(cards) {
        var card, cards_id;
        cards_id = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = cards.length; _i < _len; _i++) {
            card = cards[_i];
            _results.push(card._id);
          }
          return _results;
        })();
        return $.getJSON("" + _this.locale_url + "?q=" + (JSON.stringify({
          _id: {
            $in: cards_id
          }
        })), function(langs) {
          var card_type, i, lang;
          cards = (function() {
            var _i, _j, _len, _len1, _results;
            _results = [];
            for (_i = 0, _len = langs.length; _i < _len; _i++) {
              lang = langs[_i];
              for (_j = 0, _len1 = cards.length; _j < _len1; _j++) {
                card = cards[_j];
                if (card._id === lang._id) {
                  $.extend(lang, card);
                  break;
                }
              }
              card_type = [];
              i = 0;
              while (lang.type) {
                if (lang.type & 1) {
                  card_type.push(this.card_types[i]);
                }
                lang.type >>= 1;
                i++;
              }
              _results.push({
                id: card._id,
                alias: card.alias,
                name: lang.name,
                card_type: card_type,
                type: lang.race ? (i = 0, (function() {
                  var _results1;
                  _results1 = [];
                  while (!(lang.race >> i & 1)) {
                    _results1.push(i++);
                  }
                  return _results1;
                })(), this.types[i]) : void 0,
                attribute: lang.attribute ? (i = 0, (function() {
                  var _results1;
                  _results1 = [];
                  while (!(lang.attribute >> i & 1)) {
                    _results1.push(i++);
                  }
                  return _results1;
                })(), this._attributes[i]) : void 0,
                level: card.level,
                atk: card.atk,
                def: card.def,
                description: lang.desc
              });
            }
            return _results;
          }).call(_this);
          _this.refresh(cards);
          return callback(cards);
        });
      });
    };

    return Card;

  })(Spine.Model);

  CardUsage = (function(_super) {

    __extends(CardUsage, _super);

    function CardUsage() {
      return CardUsage.__super__.constructor.apply(this, arguments);
    }

    CardUsage.configure('CardUsage', 'card_id', 'count', 'side');

    CardUsage.belongsTo('card', Card);

    return CardUsage;

  })(Spine.Model);

  Deck = (function(_super) {

    __extends(Deck, _super);

    Deck.prototype.deck_name = "";

    Deck.prototype.events = {
      'mouseover .card_usage': 'show',
      'click .card_usage': 'add',
      'contextmenu .card_usage': 'minus'
    };

    Deck.prototype.key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*-=";

    function Deck() {
      this.render = __bind(this.render, this);
      Deck.__super__.constructor.apply(this, arguments);
      CardUsage.bind("refresh change", this.render);
    }

    Deck.prototype.encode = function() {
      var c, card_usage, i, result, _i, _j, _len, _ref;
      result = '';
      _ref = this.main.concat(this.extra, this.side);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card_usage = _ref[_i];
        c = card_usage.side << 29 | card_usage.count << 27 | card_usage.card_id;
        for (i = _j = 4; _j >= 0; i = --_j) {
          result += this.key.charAt((c >> i * 6) & 0x3F);
        }
      }
      return result;
    };

    Deck.prototype.decode = function(str) {
      var card_id, card_usages, char, count, decoded, i, side;
      card_usages = (function() {
        var _i, _j, _len, _ref, _ref1, _results;
        _results = [];
        for (i = _i = 0, _ref = str.length; _i < _ref; i = _i += 5) {
          decoded = 0;
          _ref1 = str.substr(i, 5);
          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            char = _ref1[_j];
            decoded = (decoded << 6) + this.key.indexOf(char);
          }
          card_id = decoded & 0x07FFFFFF;
          side = decoded >> 29;
          count = decoded >> 27 & 0x3;
          _results.push({
            card_id: card_id,
            side: side,
            count: count
          });
        }
        return _results;
      }).call(this);
      return this.refresh(card_usages);
    };

    Deck.prototype.refresh = function(card_usages, set_history) {
      var card_usage, cards_need_load,
        _this = this;
      if (set_history == null) {
        set_history = true;
      }
      cards_need_load = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = card_usages.length; _i < _len; _i++) {
          card_usage = card_usages[_i];
          if (!Card.exists(card_usage.card_id)) {
            _results.push(card_usage.card_id);
          }
        }
        return _results;
      })();
      if (cards_need_load.length) {
        return Card.query({
          _id: {
            $in: cards_need_load
          }
        }, function() {
          CardUsage.refresh(card_usages, {
            clear: true
          });
          if (set_history) {
            return _this.set_history();
          }
        });
      } else {
        CardUsage.refresh(card_usages, {
          clear: true
        });
        if (set_history) {
          return this.set_history();
        }
      }
    };

    Deck.prototype.render = function() {
      var card_usage, card_width, category, category_count, deck_width, extra_count, extra_margin, i, main_count, main_margin, side_count, side_margin, _i, _len, _ref,
        _this = this;
      this.main = [];
      this.side = [];
      this.extra = [];
      main_count = 0;
      side_count = 0;
      extra_count = 0;
      category_count = {};
      _ref = Card.categories;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        category = _ref[_i];
        category_count[category] = 0;
      }
      CardUsage.each(function(card_usage) {
        var card, card_type;
        card = card_usage.card();
        if (card_usage.side) {
          _this.side.push(card_usage);
          return side_count += card_usage.count;
        } else if (((function() {
          var _j, _len1, _ref1, _results;
          _ref1 = card.card_type;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            card_type = _ref1[_j];
            if (__indexOf.call(Card.card_types_extra, card_type) >= 0) {
              _results.push(card_type);
            }
          }
          return _results;
        })()).length) {
          _this.extra.push(card_usage);
          return extra_count += card_usage.count;
        } else {
          _this.main.push(card_usage);
          main_count += card_usage.count;
          return category_count[((function() {
            var _j, _len1, _ref1, _results;
            _ref1 = card.card_type;
            _results = [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              category = _ref1[_j];
              if (__indexOf.call(Card.categories, category) >= 0) {
                _results.push(category);
              }
            }
            return _results;
          })()).pop()] += card_usage.count;
        }
      });
      if ($('.operate_area').hasClass('graphic')) {
        window.main_count = main_count > 40 ? main_count : 'auto';
        window.side_count = side_count > 10 ? side_count : 'auto';
        window.extra_count = extra_count > 10 ? extra_count : 'auto';
      }
      this.html($('#deck_template').tmpl({
        main: this.main,
        side: this.side,
        extra: this.extra,
        main_count: main_count,
        side_count: side_count,
        extra_count: extra_count,
        category_count: category_count
      }));
      $('#search_card').html($('#search_card_template').tmpl({
        test: 'test'
      }));
      $('#deck_url_ydk').attr('download', this.deck_name + '.ydk');
      $('#deck_url_ydk').attr('href', 'data:application/x-ygopro-deck,' + encodeURI(["#generated by mycard/web"].concat((function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.main;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          card_usage = _ref1[_j];
          _results.push(((function() {
            var _k, _ref2, _results1;
            _results1 = [];
            for (i = _k = 0, _ref2 = card_usage.count; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
              _results1.push(card_usage.card_id);
            }
            return _results1;
          })()).join("\r\n"));
        }
        return _results;
      }).call(this), (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.extra;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          card_usage = _ref1[_j];
          _results.push(((function() {
            var _k, _ref2, _results1;
            _results1 = [];
            for (i = _k = 0, _ref2 = card_usage.count; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
              _results1.push(card_usage.card_id);
            }
            return _results1;
          })()).join("\r\n"));
        }
        return _results;
      }).call(this), ["!side"], (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.side;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          card_usage = _ref1[_j];
          _results.push(((function() {
            var _k, _ref2, _results1;
            _results1 = [];
            for (i = _k = 0, _ref2 = card_usage.count; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; i = 0 <= _ref2 ? ++_k : --_k) {
              _results1.push(card_usage.card_id);
            }
            return _results1;
          })()).join("\r\n"));
        }
        return _results;
      }).call(this)).join("\r\n")));
      $(".deck_part").sortable({
        connectWith: ".deck_part",
        stop: function() {
          var card_id, card_usages, el, last_item, side, _j, _len1, _ref1;
          card_usages = [];
          last_item = null;
          _ref1 = $('.card_usage');
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            el = _ref1[_j];
            card_id = $(el).tmplItem().data.card_id;
            side = $(el).parent().hasClass('side');
            if (last_item) {
              if (last_item.card_id === card_id && last_item.side === side) {
                last_item.count++;
              } else {
                card_usages.push(last_item);
                last_item = {
                  card_id: card_id,
                  side: side,
                  count: 1
                };
              }
            } else {
              last_item = {
                card_id: card_id,
                side: side,
                count: 1
              };
            }
          }
          card_usages.push(last_item);
          _this.refresh(card_usages);
          return _this.set_history();
        }
      }).disableSelection();
      if ($('.operate_area').hasClass('text')) {
        return this.el.jscroll({
          W: "12px",
          Btn: {
            btn: false
          }
        });
      } else {
        deck_width = $('.deck_part').width();
        card_width = $('.card_usage').width();
        main_margin = Math.floor((deck_width - card_width * Math.max(Math.ceil(main_count / 4), 10)) / (Math.max(Math.ceil(main_count / 4), 10) - 1) / 2);
        $('.deck_part.main').css({
          'margin-left': -main_margin,
          'margin-right': -main_margin
        });
        $('.deck_part.main .card_usage').css({
          'margin-left': main_margin,
          'margin-right': main_margin
        });
        side_margin = Math.floor((deck_width - card_width * Math.max(side_count, 10)) / (Math.max(side_count, 10) - 1) / 2);
        $('.deck_part.side').css({
          'margin-left': -side_margin,
          'padding-right': -side_margin
        });
        $('.deck_part.side .card_usage').css({
          'margin-left': side_margin,
          'margin-right': side_margin
        });
        extra_margin = Math.floor((deck_width - card_width * Math.max(extra_count, 10)) / (Math.max(extra_count, 10) - 1) / 2);
        $('.deck_part.extra').css({
          'margin-left': -extra_margin,
          'padding-right': -extra_margin
        });
        return $('.deck_part.extra .card_usage').css({
          'margin-left': extra_margin,
          'margin-right': extra_margin
        });
      }
    };

    Deck.prototype.location = function() {
      return "/decks/?name=" + this.deck_name + "&cards=" + (this.encode());
    };

    Deck.prototype.url = function() {
      return "http://my-card.in" + this.location();
    };

    Deck.prototype.set_history = function() {
      return history.pushState(CardUsage.toJSON(), this.deck_name, this.location());
    };

    Deck.prototype.tab_control = function() {
      $(".bottom_area div").click(function() {
        var $dangqian;
        $(this).addClass("bottom_button_active").removeClass("bottom_button");
        $(this).siblings().addClass("bottom_button").removeClass("bottom_button_active");
        $dangqian = $(".card_frame .frame_element").eq($(".bottom_area div").index(this));
        $dangqian.addClass("card_frame_focus");
        return $dangqian.siblings().removeClass("card_frame_focus");
      });
      return $('.card_frame .frame_element').jscroll({
        W: "12px",
        Btn: {
          btn: false
        }
      });
    };

    Deck.prototype.show = function(e) {
      var active_page_index, card;
      card = $(e.target).tmplItem().data.card();
      $('#card').removeClass(Card.card_types.join(' '));
      active_page_index = $('.bottom_area div').index($(".bottom_button_active"));
      $('#card').html($("#card_template").tmpl(card));
      $('#card').addClass(card.card_type.join(' '));
      $('.card_frame .frame_element').eq(active_page_index).addClass('card_frame_focus');
      $('.bottom_area div').eq(active_page_index).addClass('bottom_button_active').removeClass("bottom_button");
      return this.tab_control();
    };

    Deck.prototype.add = function(e) {
      var c, card_usage, count, _i, _len, _ref;
      card_usage = $(e.target).tmplItem().data;
      count = 0;
      _ref = CardUsage.findAllByAttribute('card_id', card_usage.card_id);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        count += c.count;
      }
      if (count < 3) {
        card_usage.count++;
        card_usage.save();
      }
      return this.set_history();
    };

    Deck.prototype.minus = function(e) {
      var card_usage;
      e.preventDefault();
      card_usage = $(e.target).tmplItem().data;
      card_usage.count--;
      if (card_usage.count) {
        card_usage.save();
      } else {
        card_usage.destroy();
      }
      return this.set_history();
    };

    return Deck;

  })(Spine.Controller);

  $(document).ready(function() {
    var deck;
    $('#name').html($.url().param('name'));
    $("#deck_share_dialog").dialog({
      modal: true,
      autoOpen: false
    });
    deck = new Deck({
      el: $("#deck")
    });
    deck.deck_name = $.url().param('name');
    deck.tab_control();
    $('#deck_share').click(function() {
      $("#deck_url").val(deck.url());
      $("#deck_url_qrcode").attr('src', 'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chld=|0&chl=' + encodeURIComponent(deck.url()));
      return $("#deck_share_dialog").dialog('open');
    });
    $('#deck_url_shorten').click(function() {
      $('#deck_url_shorten').attr("disabled", true);
      return $.ajax({
        url: 'https://www.googleapis.com/urlshortener/v1/url',
        type: 'POST',
        data: JSON.stringify({
          longUrl: deck.url()
        }),
        contentType: 'application/json; charset=utf-8',
        success: function(data) {
          $("#deck_url").val(data.id);
          return $('#deck_url_shorten').attr("disabled", false);
        }
      });
    });
    $('#deck_load').change(function() {
      var file, reader;
      file = this.files[0];
      reader = new FileReader();
      if (file) {
        $('#deck_load').attr('disabled', true);
      }
      reader.onload = function(ev) {
        var card_id, count, last_id, line, lines, result, side, _i, _len;
        $('#deck_load').attr('disabled', false);
        result = [];
        lines = ev.target.result.split("\n");
        side = false;
        last_id = 0;
        count = 0;
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          if (!line || line.charAt(0) === '#') {
            continue;
          } else if (line.substr(0, 5) === '!side') {
            if (last_id) {
              result.push({
                card_id: last_id,
                side: side,
                count: count
              });
            }
            side = true;
            last_id = null;
          } else {
            card_id = parseInt(line);
            if (card_id) {
              if (card_id === last_id) {
                count++;
              } else {
                if (last_id) {
                  result.push({
                    card_id: last_id,
                    side: side,
                    count: count
                  });
                }
                last_id = card_id;
                count = 1;
              }
            } else {
              alert('无效卡组');
              return;
            }
          }
        }
        if (last_id) {
          result.push({
            card_id: last_id,
            side: side,
            count: count
          });
        }
        $('#name').html(deck.deck_name = file.name.split('.')[0]);
        deck.refresh(result);
        return deck.set_history();
      };
      return reader.readAsText(file);
    });
    return $.i18n.properties({
      name: 'card',
      path: '/locales/',
      mode: 'map',
      cache: true,
      callback: function() {
        Card.fetch(function() {
          $('#search').submit(function() {
            Card.fetch_by_name($('.search_input').val());
            return false;
          });
          deck.decode($.url().param('cards'));
          return window.addEventListener('popstate', function(ev) {
            if (ev.state) {
              return deck.refresh(ev.state, false);
            }
          });
        });
        Card.fetch();
        return $(".rename_ope").click(function() {
          $(".text,.graphic").toggleClass("graphic text");
          return deck.render();
        });
      }
    });
  });

}).call(this);
