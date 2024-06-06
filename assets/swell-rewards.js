(function() {
  var timeout = 0;
  if (!window.jQuery) {
    timeout = 300;
  }

  setTimeout(function() {
    if (window.jQuery) {
      swell();
    } else {
      setTimeout(function() {
        swell();
      }, 1000);
    }

    function swell() {
      jQuery(document).ready(function($) {
        $(document).on("swell:setup", function() {
          SwellConfig.Tier.initializeDummyTier();
          SwellConfig.Tier.initializeCustomTierProperties();
          SwellConfig.Tier.initializeTiers(".swell-tier-table");
          Swell.Referral.initializeReferral(".swell-referral", SwellConfig.Referral.opts);

          $(".swell-referral-loader").hide();
          $(".swell-post-checkout-swimwear").css("display", "flex")
          $('body').on('click', '.swell-post-checkout-swimwear .swell-referral-back-link', function() {
            $(".swell-post-checkout-swimwear").hide();
          });

          if(spapi.authenticated  && spapi.customer.birthday && spapi.customer.birthday.month) {
            $(".swell-birthday-form").hide();
            $(".swell-birthday-msg").html("You've already submitted your birthday. We look forward to celebrating!");
          } else {
            $(".swell-birthday-form").css("display", "flex");
          }


          $(document).on("click", "#swell-birthday-submit", function() {
            splitter = $("#swell-birthday").val().indexOf("/")
            date = $("#swell-birthday").val().substr(0, splitter);
            birthday_month = $("#swell-birthday").val().substr(splitter + 1);

            function onSuccess() {
              $(".swell-birthday-msg").html("Customer birthday successfully saved");
              $(".swell-birthday-detail").css("margin-bottom", "15px");
              $(".swell-birthday-msg").css("margin-bottom", "10px");
              $(".swell-birthday-form").hide();
            };

            function onError() {
              $(".swell-birthday-msg").html("There was an error saving birthday, please ensure its in correct format of DD/MM");
              $(".swell-birthday-detail").css("margin-bottom", "15px");
              $(".swell-birthday-msg").css("margin-bottom", "10px");
            };

            if (date.length == 2 && birthday_month.length == 2) {
              spapi.createCustomerBirthday({
                month: birthday_month,
                day: date
              }, onSuccess, onError);
            } else {
              onError();
            }

          });

          if(spapi.authenticated) {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            if (spapi.customer.vip_tier_subscription_date) {

              subscription_date = spapi.customer.vip_tier_subscription_date;

              subscription = new Date(subscription_date);
              subscription_date = subscription.getDate();
              subscription_month = months[subscription.getMonth()];
              subscription_year = subscription.getFullYear();

              $('.vip-subscription-date').html(subscription_month + ' ' + subscription_date + ', ' + subscription_year);

              tiers = spapi.activeVipTiers;
              tiers.forEach(function(tier) {
                if (spapi.customer.vip_tier.id == tier.id) {
                  customer_tier = tier;
                }
              });

              tier_spend_required = (customer_tier.amount_spent_cents - (spapi.customer.vip_tier_stats.amount_spent_cents - customer_tier.amount_spent_cents)) / 100;

              if (tier_spend_required <= 0) {
              } else {
                $('.tier-spend-required').html(tier_spend_required);
              }
            } else {
              if(spapi.customer.created_at) {
                joining_date = spapi.customer.created_at;
                joining = new Date(joining_date);
                joining_date = joining.getDate();
                joining_month = months[joining.getMonth()];
                joining_year = joining.getFullYear();

                $('.vip-subscription-date').html(joining_month + ' ' + joining_date + ', ' + joining_year);
              } else {
                $('.vip-subscription-date').html('Joining');
              }
            }

            if(spapi.customer.vip_tier_stats) {
              $(".lifetime-spend").html(spapi.customer.vip_tier_stats.amount_spent_cents / 100);
              $('.tier-spend-required').html(400 - (spapi.customer.vip_tier_stats.amount_spent_cents / 100));
            } else {
              $(".lifetime-spend").html("0");
              $('.tier-spend-required').html("400");
            }
          }

          setupReferrals();

          $( document ).on('click',"#swell-referral-register-submit", function() {
            setTimeout(function(){
              if(spapi.customer.referral_receipts) {
                setupReferrals();
                if(spapi.customer.email) {
                  $(".swell-referral-content-main").addClass("refer-step");
                }
              } else {
                setTimeout(function(){
                  setupReferrals();
                  if(spapi.customer.email) {
                    $(".swell-referral-content-main").addClass("refer-step");
                  }
                },1000)
              }
            },1000)
          });

          $(document).on("swell:referral:success", function() {
            swellAPI.refreshCustomerDetails(function(){
              var customerDetails = swellAPI.getCustomerDetails();
              referrals = customerDetails.referrals;

              $(".redeem-holder").show();

              $(".swell-referral-table tbody").html("");

              referrals.forEach(function(referral) {
                status = null;

                if(referral.completedAt){
                  status = "Purchased(" + spapi.activeReferralCampaign.reward_text + " earned)";
                } else {
                  status = "Invited";
                }

                $(".swell-referral-table tbody").append('<tr> <td>' +  referral.email + '</td><td>' + status +'</td></tr>');
              });
            });
          });

          $(document).on("swell:referral:error", function(jqXHR, textStatus, errorThrown) {
            if(textStatus && textStatus === "EMAILS_ALREADY_PURCHASED"){
              $(".refer-customer-error").remove();
              $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Sorry! Looks like this person has already made a purchase. Try referring another friend.</p>');
              $("#swell-referral-refer-emails").addClass("error-border");
            }

            if(textStatus && textStatus === "Please enter a valid email address"){
                $(".refer-customer-error").remove();
                $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Please enter valid email addresses seperated with commas</p>');
                $("#swell-referral-refer-emails").addClass("error-border");
              }
          });

          $(".swell-tier-arrows .right-arrow").click(function() {
            var last = false;
            var length = $(".swell-tier-table thead tr:nth-child(1) th").length;

            for(counter = 2; counter <= length ; counter++) {
             if (!$(".swell-tier-table thead tr th:nth-child(" + counter + ")").hasClass("hidden")) {
               if(counter == length) {
                 last = true;
               }
               break;
             }
            }

            if(last == true) {
             $(".swell-tier-table  tr th:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table  tr th:nth-child("+(counter - 2)+")").removeClass("hidden");

             $(".swell-tier-table  tr td:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table  tr td:nth-child("+(counter - 2)+")").removeClass("hidden");
            } else {
             $(".swell-tier-table  tr th:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table  tr th:nth-child("+(counter + 1)+")").removeClass("hidden");

             $(".swell-tier-table  tr td:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table  tr td:nth-child("+(counter + 1)+")").removeClass("hidden");
            }
          });

          $(".swell-tier-arrows .left-arrow").click(function() {
            var first = false;
            var length = $(".swell-tier-table thead tr:nth-child(1) th").length;

            for(counter = 2; counter <= length ; counter++) {
             if (!$(".swell-tier-table thead tr th:nth-child(" + counter + ")").hasClass("hidden")) {
               if(counter == 2) {
                 first = true;
               }
               break;
             }
            }

            if(first == true) {
             $(".swell-tier-table  tr th:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table  tr th:nth-child("+(counter + 2)+")").removeClass("hidden");

             $(".swell-tier-table  tr td:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table  tr td:nth-child("+(counter + 2)+")").removeClass("hidden");
            } else {
             $(".swell-tier-table thead tr th:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table thead tr th:nth-child("+(counter - 1)+")").removeClass("hidden");

             $(".swell-tier-table tbody tr td:nth-child(" + counter + ")").addClass("hidden");
             $(".swell-tier-table tbody tr td:nth-child("+(counter - 1)+")").removeClass("hidden");
            }
          });
        });

        // faqs initializer
        (function() {
          var classNames, selectors,
            indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

          classNames = {
            container: "swell-question-content",
            heading: "swell-question-heading",
            section: "swell-question-details",
            open: "swell-question-open"
          };

          selectors = {
            container: "." + classNames.container,
            heading: "." + classNames.heading,
            section: "." + classNames.section,
            open: "." + classNames.open
          };

          $(document).ready(function() {
            var hash, heading, openCollapsiblesForAnchor, toHide;
            openCollapsiblesForAnchor = function(hash, redirect) {
              var anchors, el, name;
              name = hash.substr(1);
              anchors = $(selectors.container).find(hash + ", a[name=\"" + name + "\"]");
              if (anchors.length > 0) {
                el = $(anchors[0]);
                el.closest(selectors.container).find(selectors.heading).click();
                return el.closest(selectors.section).promise().done(function() {
                  return window.location = redirect;
                });
              } else if ($(hash).is(selectors.container)) {
                return $(hash).find(selectors.heading).click();
              }
            };
            $(selectors.container).css("overflow", "hidden");
            toHide = $(selectors.container).not(selectors.open).find(selectors.section);
            heading = $(selectors.heading);
            toHide.hide();
            heading.css("cursor", "pointer");
            heading.click(function() {
              var parent, t;
              t = $(this);
              parent = t.parent();
              if (parent.hasClass(classNames.open)) {
                parent.removeClass(classNames.open);
                t.attr("aria-expanded", "false");
              } else {
                parent.addClass(classNames.open);
                t.attr("aria-expanded", "true");
              }
              t.next().slideToggle("fast");
              return false;
            });
            $(document).keydown(function(e) {
              if ((32 === e.keyCode || 13 === e.keyCode) && $(e.target).hasClass(classNames.heading)) {
                e.preventDefault();
                e.target.click();
                return false;
              }
            });
            if (window.location.hash) {
              hash = window.location.hash;
              openCollapsiblesForAnchor(hash, window.location);
            }
            if (indexOf.call(window, "onhashchange") >= 0) {
              return $(window).bind("hashchange", function(e) {
                hash = window.location.hash;
                return openCollapsiblesForAnchor(hash, window.location);
              });
            }
          });
        }).call(this);

        function setupReferrals (){
          if(spapi.authenticated || spapi.customer.email) {
            if(spapi.customer.referral_receipts.length > 0) {
              $(".redeem-holder").show();

              referrals = spapi.customer.referral_receipts;

              referrals.forEach(function(referral) {
                status = null;

                if(referral.completed_at){
                  status = "Purchased(" + spapi.activeReferralCampaign.reward_text + " earned)";
                } else {
                  status = "Invited";
                }

                $(".swell-referral-table tbody").append('<tr> <td>' +  referral.email + '</td><td>' + status +'</td></tr>');
              });
            }
          }
        }

        (function() {
          window.SwellConfig = window.SwellConfig || {};

          SwellConfig.Referral = {
            opts: {
              localization: {
                referralRegisterHeading: "Give 15%, Get <%= referralCampaign.reward_text %>",
                referralRegisterFormDetails: "",
                referralRegisterFormEmail: "Your Email",
                referralRegisterFormSubmit: "INVITE FRIENDS",
                referralRegisterDetails: "<%= referralCampaign.details %>",

                referralReferHeading: "Give 15%, Get <%= referralCampaign.reward_text %>",
                referralReferFormEmails: "Your Friends’ Emails (separated by commas)",
                referralReferFormSubmit: "Send",
                referralReferFormDetails: "",
                referralReferFormEmailsDetails: "",
                referralReferDetails: "<%= referralCampaign.details %>",

                referralReferMediaDetails: "You can also share your link with the buttons below.",

                referralShareFacebook: "Share",
                referralShareTwitter: "Tweet",
                referralShareCopy: "Copy Link",
                referralShareMessenger: "Message",
                referralShareSMS: "SMS",

                referralFacebookIcon: "swell-icon-fb",
                referralTwitterIcon: "swell-icon-twitter",
                referralLinkIcon: "swell-icon-link",
                referralMessengerIcon: "swell-icon-msg",
                referralSMSIcon: "swell-icon-sms",

                referralThanksHeading: "Thanks for Referring!",
                referralThanksDetails: "Remind your friends to check their emails.",

                referralCopyHeading: "Share your link",
                referralCopyButton: "COPY LINK",
                referralCopyDetails: "You can share your link as much as you want over texts, DM, on your feed, or wherever you want to share the love."
              },
              templates: {
                referralRefer: '<div class="swell-referral-refer"> <h2 class="swell-referral-heading"><%= localization.referralReferHeading %></h2> <p class="swell-referral-details"><%= localization.referralReferDetails %></p> <div class="swell-referral-form-wrapper"> <form class="swell-referral-form" name="swell-referral-refer-form" id="swell-referral-refer-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"><%= localization.referralReferFormDetails %></p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="text" name="swell-referral-refer-emails" id="swell-referral-refer-emails" required="required" placeholder="<%= localization.referralReferFormEmails %>"> <span class="swell-referral-form-field-details"><%= localization.referralReferFormEmailsDetails %></span> </li> </ul> </div> <div class="swell-referral-form-footer"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-refer-submit" id="swell-referral-refer-submit" value="<%= localization.referralReferFormSubmit %>"> </div> </form> </div> <div class="swell-referral-media-wrapper"> <p class="swell-referral-media-details"><%= localization.referralReferMediaDetails %></p> <ul class="swell-referral-media-list"> <li class="swell-referral-medium swell-share-referral-facebook"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralFacebookIcon %>" aria-hidden="true"></i>&nbsp; <%= localization.referralShareFacebook %> </div> </li> <li class="swell-referral-medium swell-share-referral-twitter"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralTwitterIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareTwitter %></div> </li> <li class="swell-referral-medium swell-share-referral-sms"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralSMSIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareSMS %></div> </li> <li class="swell-referral-medium swell-share-referral-messenger"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralMessengerIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralShareMessenger %></div> </li> <li class="swell-referral-medium swell-share-referral-copy"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp; <%= localization.referralShareCopy %> </div> </li> </ul> </div> </div>'
                // referralCopy: '<div class="swell-referral-copy"> <div class="swell-referral-copy-content"> <div class="swell-referral-copy-sidebar"></div> <div class="swell-referral-copy-main"> <span class="swell-referral-back-link"></span> <h2 class="swell-referral-heading"> <i class="swell-referral-heading-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralCopyHeading %> </h2> <div class="swell-referral-form-wrapper"> <div class="swell-referral-copy-link" id="swell-referral-copy-link"><%= customer.referralLink %></div> <button class="swell-referral-copy-button" id="swell-referral-copy-button" data-clipboard-target="#swell-referral-copy-link"><%= localization.referralCopyButton %></button> <p class="swell-referral-details"><%= localization.referralCopyDetails %></p> </div> </div> </div> <div>',
              }
            }
          };
        }).call(this);

        (function() {
          window.SwellConfig = window.SwellConfig || {};

          SwellConfig.Tier = {
            getCustomerTierId: function() {
              var customer_tier, intro_tier, tiers;
              customer_tier = spapi.customer.vip_tier;
              tiers = spapi.activeVipTiers;
              if (customer_tier) {
                return customer_tier.id;
              } else {
                intro_tier = $.grep(tiers, function(e) {
                  return e.swellrequiredAmountSpent === "$0" && e.swellrequiredAmountSpentCents === 0 && e.swellrequiredPointsEarned === 0 && e.swellrequiredPurchasesMade === 0 && e.swellrequiredReferralsCompleted === 0;
                });
                if (intro_tier.length > 0) {
                  return intro_tier[0].id;
                } else {
                  return null;
                }
              }
            },
            getCustomerTierRank: function() {
              var customer_tier, intro_tier, rank, tiers;
              customer_tier = spapi.customer.vip_tier;
              tiers = spapi.activeVipTiers;
              if (customer_tier && customer_tier.id) {
                rank = $.grep(tiers, function(e) {
                  return e.id === customer_tier.id;
                })[0].rank;
                return rank;
              } else {
                intro_tier = $.grep(tiers, function(e) {
                  return e.swellrequiredAmountSpent === "$0" && e.swellrequiredAmountSpentCents === 0 && e.swellrequiredPointsEarned === 0 && e.swellrequiredPurchasesMade === 0 && e.swellrequiredReferralsCompleted === 0;
                });
                if (intro_tier.length > 0) {
                  return intro_tier[0].rank;
                } else {
                  return null;
                }
              }
            },
            getTierByRank: function(rank) {
              var tiers;
              tiers = spapi.activeVipTiers;
              return $.grep(tiers, function(e) {
                return e.rank === rank;
              })[0];
            },
            setupCustomerTierStatus: function() {
              var $tierStatusRow, $tierValueRow, col, columnLength, customer_tier_id, customer_tier_rank, data_id, dollar_difference, encouragement, index, k, l, next_tier, ref, ref1;
              customer_tier_id = SwellConfig.Tier.getCustomerTierId();
              customer_tier_rank = SwellConfig.Tier.getCustomerTierRank();
              next_tier = SwellConfig.Tier.getTierByRank(customer_tier_rank + 1);

              tiers = spapi.activeVipTiers;
              tiers.forEach(function(tier) {
                if (customer_tier_id == tier.id) {
                  customer_tier = tier;
                }
              });

              $("[data-tier-id=\"" + customer_tier_id + "\"]").addClass("swell-tier-active");
              $(".current-tier-name").html(customer_tier.name);
              $(".current-tier-level").html(customer_tier.rank + 1);
              if(next_tier) {
                $(".next-tier-name").html(next_tier.name);
              } else {
                $(".next-tier-list").hide();
              }

              if (spapi.isMobile) {
                // SwellConfig.Tier.tierTableOnMobile(customer_tier_rank + 2);
              }
            },
            tierTableOnMobile: function(current) {
               var columnLength = $(".swell-tier-table .swell-tier-values").children().length;
               for(counter = 2;counter<=columnLength;counter++) {
                 if(counter!=current) {
                   $(".swell-tier-table tr th:nth-child(" + counter + ")").addClass("hidden");
                   $(".swell-tier-table tr td:nth-child(" + counter + ")").addClass("hidden");
                 }
               }
             },
            initializeDummyTier: function() {
              var k, len, tier, tiers;
              tiers = spapi.activeVipTiers;
              for (k = 0, len = tiers.length; k < len; k++) {
                tier = tiers[k];
                tier.rank += 1;
              }
              return tiers.unshift({
                id: -1,
                rank: 0,
                name: "Liking It",
                display_name: "<span class='level-status'>Level 1</span>Liking It",
                points: "free to join",
                birthday_points: "<span class=\"circle\" aria-hidden=\"true\"></span>",
                early_access_sale: "",
                early_access_products: "",
                off_purcheses: "",
                swellrequiredAmountSpent: "$0",
                swellrequiredAmountSpentCents: 0,
                swellrequiredPointsEarned: 0,
                swellrequiredPurchasesMade: 0,
                swellrequiredReferralsCompleted: 0
              });
            },
            initializeCustomTierProperties: function() {
              spapi.activeVipTiers[1].display_name = "<span class='level-status'>Level 2</span>Loving It";
              spapi.activeVipTiers[1].points = "$400 lifetime spend";
              spapi.activeVipTiers[1].birthday_points = "<span class=\"circle\" aria-hidden=\"true\"></span>";
              spapi.activeVipTiers[1].early_access_sale = "<span class=\"circle\" aria-hidden=\"true\"></span>";
              spapi.activeVipTiers[1].early_access_products = "<span class=\"circle\" aria-hidden=\"true\"></span>";
              spapi.activeVipTiers[1].off_purcheses = "10% of all purchases for life";
              spapi.activeVipTiers[2].display_name = "<span class='level-status'>Level 3</span>Obsessed";
              spapi.activeVipTiers[2].points = "$800 lifetime spend";
              spapi.activeVipTiers[2].birthday_points = "<span class=\"circle\" aria-hidden=\"true\"></span>";
              spapi.activeVipTiers[2].early_access_sale = "<span class=\"circle\" aria-hidden=\"true\"></span>";
              spapi.activeVipTiers[2].early_access_products = "<span class=\"circle\" aria-hidden=\"true\"></span>";
              spapi.activeVipTiers[2].off_purcheses = "15% off all purchases for life";
            },
            initializeTiers: function(containerSelector) {
              var i, j, key, properties, property, ref, ref1, tiers;
              if ($(containerSelector).length === 0) {
                return "";
              }
              tiers = spapi.activeVipTiers;
              properties = {
                header: {
                  display_name: {
                    className: "swell-tier-names",
                    title: "Benefits"
                  },
                  points: {
                    className: "swell-tier-values",
                    title: ""
                  }
                },
                body: {
                  birthday_points: {
                    title: "Annual birthday gift"
                  },
                  early_access_sale: {
                    title: "Early access to sales"
                  },
                  early_access_products: {
                    title: "Early access to new arrivals"
                  },
                  off_purcheses: {
                    title: "Save on every purchase"
                  }
                }
              };
              $(containerSelector).append("<thead></thead>");
              $(containerSelector).append("<tbody></tbody>");
              j = 0;
              ref = properties.header;
              for (key in ref) {
                property = ref[key];
                $(containerSelector).find("thead").append("<tr class=\"" + property.className + "\">\n  <th scope=\"row\">" + property.title + "</th>\n</tr>");
                tiers.forEach(function(tier) {
                  return $(containerSelector).find("thead tr:eq(" + j + ")").append("<th scope=\"col\" data-tier-id=\"" + tier.id + "\">" + tier[key] + "</th>");
                });
                j++;
              }
              i = 0;
              ref1 = properties.body;
              for (key in ref1) {
                property = ref1[key];
                $(containerSelector).find("tbody").append("<tr>\n  <th scope=\"row\">" + property.title + "</th>\n</tr>");
                tiers.forEach(function(tier) {
                  return $(containerSelector).find("tbody tr:eq(" + i + ")").append("<td data-tier-id=\"" + tier.id + "\">" + tier[key] + "</td>");
                });
                i++;
              }
              if (spapi.authenticated) {
                return SwellConfig.Tier.setupCustomerTierStatus();
              } else if (spapi.isMobile){
                // SwellConfig.Tier.tierTableOnMobile(2);
              }

              // $(window).resize(function(){
              //   if($(document).width() < 758) {
              //     if(spapi.authenticated) {
              //       // SwellConfig.Tier.tierTableOnMobile(customer_tier_rank + 2);
              //     } else {
              //       // SwellConfig.Tier.tierTableOnMobile(2);
              //     }

              //   } else {
              //   }
              // });
                 $(".swell-tier-table  tr th").removeClass("hidden");
                 $(".swell-tier-table  tr td").removeClass("hidden");
            }
          };
        }).call(this);
      });
    }
  },timeout);
}).call(this);
