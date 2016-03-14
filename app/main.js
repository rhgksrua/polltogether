'use strict';

// Declare app level module which depends on views, and components
angular.module('pollApp', [
        'ngRoute',
        'pollApp.pollCreate',
        'pollApp.pollVote',
        'pollApp.pollResult',
        'pollApp.register',
        'pollApp.login',
        'pollApp.user',
        'pollApp.userPassword'
    ])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('tokenInjector');
        $routeProvider.otherwise({redirectTo: '/create'});
    }])
    .controller('indexController', ['userService', 'tokenService', '$scope', '$timeout', '$location', '$route', function(userService, tokenService, $scope, $timeout, $location, $route) {
        var ic = this;

        $scope.share = {
            email: '',
            username: '',
            extra: 'nothing here'
        };

        ic.logout = function() {
            tokenService.removeToken();
            userService.logOut()
                .then(function(response) {
                    if (response.data.error) {
                        throw new Error(response.data.error);
                    }
                    //console.log(response.data);
                    return response;
                })
                .then(null, function(response) {
                    //console.log(response.data);
                });
            $scope.share.email = '';
            $scope.share.username = '';
            ic.loggedOut = true;
            $scope.$emit('showMessage', 'logged out');
            $location.path('/');

        };

        if (tokenService.getToken()) {
            userService.getEmail()
                .then(function(response) {
                    $scope.share.email = response.data.email;
                    $scope.share.username = response.data.username;
                }).
                then(null, function(response) {

                });
        }

        /**
         * Listens for email from ajax request 
         *
         * @return {undefined}
         */
        $scope.$on('setEmail', function(event, email, username) {
            $scope.share.email = email;
            $scope.share.username = username;
        });

        $scope.$on('showMessage', function(event, message) {
            if (!message) {
                return;
            }
            $scope.message = message || '';
            ic.showMessage = true;
            $timeout(function() {
                ic.showMessage = false;
                ic.message = '';
            }, 3000);
        });
    }]);

(function(){
'use strict';

angular.module('pollApp')
    .factory('tokenInjector', ['$window', function($window) {
        var tokenInjector = {
            request: function(config) {
                var token = $window.localStorage['auth-token'];
                if (token) {
                    config.headers.authorization = 'Bearer ' + token;
                }
                return config;
            }
        };
        return tokenInjector;
    }]);
})();

(function() {
    'use strict';

    angular.module('pollApp')
        .service('tokenService', ['$window', function($window) {
            var ts = this;
            var store = $window.localStorage;
            var key = 'auth-token';

            ts.removeToken = function() {
                store.removeItem(key);
            };

            ts.setToken = function(token) {
                if (token) {
                    store.setItem(key, token);
                } else {
                    store.removeItem(key);
                }
            };

            ts.getToken = function() {
                return store.getItem(key);
            };

            ts.flashMessage = function(msg) {
            };
            
        }])
        .service('userService', ['$http','tokenService', function($http, tokenService) {
            var us = this;

            /**
             * logOut - logs out user
             * 
             * tells server to destroy session
             *
             * @return {undefined}
             */
            us.logOut = function() {
                return $http.post('/logout')
                    .then(function(response) {
                        return response;
                    });
            };

            /**
             * getEmail - get user info
             *
             * gets username and email from server based on jwt token
             *
             * @return {undefined}
             *
             * NOTE: need to change the name
             */
            us.getEmail = function(){
                return $http.get('/userinfo')
                    .then(function(response) {
                        if (response.data.error) {
                            if (response.data.revoke) {
                                tokenService.removeToken();
                            }
                            throw new Error(response.data.error);
                        }
                        return response;
                    });
            };
        }]);
})();

(function() {
    'use strict';

    angular.module('pollApp.pollCreate', ['ngRoute', 'ngAnimate', 'ngMessages', 'ui.bootstrap'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/create', {
                templateUrl: 'create/create.html',
                controller: 'pollCtrl',
                controllerAs:'pc'
            });
        }])
        .controller('pollCtrl', ["$location", "pollService", '$window', '$scope', '$modal', function($location, pollService, $window, $scope, $modal) {
            var pc = this;
            pc.host = $location.host();
            pc.data = {choices: []};
            pc.data.choices.push({'id': 'choice0' , "vote": 0});
            pc.email = '';

            /**
             * submitNewPoll - ajax request to server to create poll
             *
             * @return {undefined}
             */
            pc.submitNewPoll = function(){
                console.log('submitting');
                pollService.createPoll(pc.data)
                    .then(function(response) {
                        pc.voteUrl = '/#/vote/' + response.data;
                        console.log('submitted', response);
                        // NEED TO ADD SERVER FAILURE ERROR
                        if (response.data.error) {
                            pc.status = 'Server does not want your stupid poll right now';
                            throw new Error('SERVER ERROR');
                        }
                        pc.serverError = false;
                        pc.status = 'Your poll has been submitted';
                        pc.open();
                    })
                    .then(null, function(response) {
                        console.log('error', response.data);
                        pc.serverError = true;
                        pc.open();
                    });
            };
            /**
             * addChoice - add a choice to poll
             *
             * @return {undefined}
             */
            pc.addChoice = function(){
                var newItem = pc.data.choices.length;
                pc.data.choices.push({'id': 'choice' + newItem ,'vote':0});
                console.log(pc.data.choices);
            };

            /**
             * resetForm - clear form
             *
             * @return {undefined}
             */
            pc.resetForm = function() {
                console.log('reset form');
                pc.data = {choices: [{'id': 'choice0' , "vote": 0}]};
            };

            /**
             * removeChoice - remove a choice from poll
             *
             * @param index
             * @return {undefined}
             */
            pc.removeChoice = function(index) {
                console.log('removing choice');
                pc.data.choices.splice(index, 1);
            };

            /**
             * open - opens modal on submit
             *
             * @param size
             * @return {undefined}
             */
            pc.open = function(size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'create/modal/createModalContent.html',
                    controller: 'modalInstanceCtrl',
                    constollerAs: 'mi',
                    size: size,
                    resolve: {
                        items: function() {
                            return {
                                serverError: pc.serverError,
                                status: pc.status,
                                voteUrl: pc.voteUrl,
                                host: pc.host
                            };
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    console.log('selectedItem: ', selectedItem);
                });
            };
        }]);
    })();


(function() {
    'use strict';

    /**
     * Modal
     *
     * @return {undefined}
     */
    angular.module('pollApp.pollCreate')
        .controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
            $scope.items = items;
            
            $scope.ok = function() {
                $modalInstance.close();
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

        }]);
})();

(function() {
    'use strict';

    angular.module('pollApp.pollCreate')
        .service('pollService', ['$http', '$window', function($http, $window) {
            var poll = this;
            var validate = function(Poll) {
                Poll.choices = Poll.choices.filter(function(el) {
                    return el.name && el.name.length > 0;
                });
                return Poll;
            };
            poll.createPoll = function(Poll){
                Poll = validate(Poll);

                //Ajax post poll to back end
                return $http.post('/poll/submit', Poll)
                    .then(function(response) {
                        // do stuff with response here
                        return response;
                    });
            };
            poll.getEmail = function(token) {
                return $http.post('/user/email')
                    .then(function(response) {
                        return response.data;
                    });
            };
        }]);
})();

(function() {
    'use strict';

    angular.module('pollApp.login', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'login/login.html',
                controller: 'loginCtrl',
                controllerAs:'lc'
            });
        }])
        .controller('loginCtrl', ["loginService", '$location', 'tokenService', 'userService', '$route', '$scope', function(loginService, $location, tokenService, userService, $route, $scope){
            var lc = this;

            console.log('why!');

            // This page is not available to logged in user
            if (tokenService.getToken()) {
                $location.path('/');
                return;
            }

            lc.user = {};
            lc.login = function(user) {
                loginService.login(user)
                    .then(function(response) {
                        if (response.data.error) {
                            console.log(response.data.error);
                            lc.loginError = true;
                            throw new Error('login error');
                        }
                        lc.loginError = false;
                        tokenService.setToken(response.data.token);
                        $scope.$emit('showMessage', 'logged in');
                        $scope.$emit('setEmail', response.data.email, response.data.username);
                        $location.path('/create');
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });
            };
        }]);
})();


'use strict';

angular.module('pollApp.login')
    .service('loginService', ['$http', '$window', function($http, $window) {
        var poll = this;
        poll.login = function(User){
            //Ajax post poll to back end
            return $http.post('/login', User)
                .then(function(response) {
                    // do stuff with response here
                    return response;
                });
        };
    }]);

(function() {
    'use strict';

    angular.module('pollApp.register', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/register', {
                templateUrl: 'register/register.html',
                controller: 'registerCtrl',
                controllerAs:'rc'
            });
        }])
        .controller('registerCtrl', ["registerService", '$location', 'tokenService', 'userService', '$route', '$scope', function(registerService, $location, tokenService, userService, $route, $scope){
            var rc = this;
            rc.user = {};
            $scope.share.email = '';

            if (tokenService.getToken()) {
                console.log('token found');
                $location.path('/');
                return;
            }

            /**
             * register - register users
             *
             * @param {object} user
             * @return {undefined}
             */
            rc.register = function(user) {
                registerService.register(user)
                    .then(function(response) {
                        // handle server side validation error
                        if (response.data.validationErrors) {
                            console.log(response.data.validationErrors);
                            rc.validationErrors = response.data.validationErrors;
                        }
                        return response;
                    })
                    .then(function(response) {
                        // handle data base error
                        if (response.data.error) {
                            throw new Error('SERVER ERROR');
                        } else if (response.data.exists) {
                            if (response.data.exists === 'email') {
                                rc.emailExists = true;
                            } else if (response.data.exists === 'username') {
                                rc.usernameExists = true;
                            }
                            throw new Error('email exists');
                        }

                        if (response.data.token) {
                            rc.emailExists = false;
                            console.log('registered');
                            console.log(response.data);
                            tokenService.setToken(response.data.token);
                            $scope.$emit('setEmail', response.data.email, response.data.username);
                            $scope.$emit('showMessage', 'registered!');
                            rc.registerSuccess = true;

                            $location.path('/');
                        }
                        
                        // redirect user to profile page
                        return response;
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });
            };
        }]);
})();


(function() {
    'use strict';

    angular.module('pollApp.register')
        .directive('compareTo', function() {
            // confirm password directive
            return {
                require: 'ngModel',
                scope: {
                    otherModelValue: '=compareTo'
                },
                link: function(scope, element, attributes, ngModel) {
                    ngModel.$validators.compareTo = function(modelValue) {
                        return modelValue == scope.otherModelValue;
                    };
                    scope.$watch('otherModelValue', function() {
                        ngModel.$validate();
                    });
                }
            };
        });
})();

'use strict';

angular.module('pollApp.register')
    .service('registerService', ['$http', '$window', function($http, $window) {
        var reg = this;
        var store = $window.localStorage;
        var key = 'auth-token';

        /**
         * sanitize - removes unwanted property from user oject
         *
         * @param {object} user
         * @return {undefined}
         */
        reg.sanitize = function(user) {
            var sanitizedUser = {
                username: user.username,
                email: user.email,
                password: user.password
            };
            return sanitizedUser;
        };

        /**
         * register - ajax request to server
         *
         * @param user
         * @return {undefined}
         */
        reg.register = function(user){
            user = reg.sanitize(user);

            //Ajax post poll to back end
            return $http.post('/register', user)
                .then(function(response) {
                    
                    // do stuff with response here
                    return response;
                });
        };
    }]);

(function() {
    'use strict';

    angular.module('pollApp.userPassword', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/user/:user/password', {
                templateUrl: 'password/password.html',
                controller: 'passwordCtrl',
                controllerAs:'pc'
            });
        }])
        .service('passwordService', ['$http', '$window', function($http, $window) {
            var ps = this;
        }])
        .controller('passwordCtrl', ["$location", "passwordService", "$routeParams", "userService", function($location, passwordService, $routeParams, userService){
            var pc = this;

            // user will contain username and new password
            pc.user = {};
            pc.error = false;

            var user = $routeParams.user;

            userService.getEmail()
                .then(function(response) {
                    if (response.data.error) {
                        // server error
                        throw new Error(response.data.error);
                    }
                    if (response.data.username === user) {
                        // user authenticated
                        pc.error = false;
                        pc.user.user = user;
                        return response;
                    }
                    pc.error = true;
                })
                .then(null, function(response) {
                    // authenication failed
                    // show error alert
                    pc.error = true;
                });

            /**
             * changePassword
             *
             * @return {undefined}
             */
            pc.changePassword = function(user) {
                console.log('changing pw');
                console.log('user inputs', user);
                passwordService.password(user)
                    .then(function(response) {
                        if (response.data.errors) {
                            console.log(resopnse.data.validationErrors);
                        }
                        return response;
                    })
                    .then(function(response) {
                        if (response.data.error) {
                            throw new Error('SERVER ERROR');
                        } else if (response.data.exists) {
                            throw new Error('exists');
                        }
                        console.log('response', response);
                        return response;
                    })
                    .then(null, function(response) {
                        console.log('error', response);
                    });

            };
        }]);
})();


'use strict';

angular.module('pollApp.userPassword')
    .service('passwordService', ['$http', '$window', function($http, $window) {
        var pass = this;
        var store = $window.localStorage;
        var key = 'auth-token';

        /**
         * sanitize - removes unwanted property from user oject
         *
         * @param {object} user
         * @return {undefined}
         */
        pass.sanitize = function(user) {
            var sanitizedUser = {
                password: user.password
            };
            return sanitizedUser;
        };

        /**
         * register - ajax request to server
         *
         * @param user
         * @return {undefined}
         */
        pass.password = function(user){
            console.log('sending new pw to server...');
            user = pass.sanitize(user);

            //Ajax post poll to back end
            return $http.post('/user/password', user)
                .then(function(response) {
                    
                    // do stuff with response here
                    return response;
                });
        };
    }]);


(function() {
    'use strict';

    angular.module('pollApp.pollResult', ['ngRoute','ngAnimate','ngMessages'])

        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/vote/:id/results', {
                templateUrl: 'results/results.html',
                controller: 'resultCtrl',
                controllerAs:'rc'
            });
        }])
        .service('resultService', ['$http', '$window', function($http, $window) {
            var rs = this;
            rs.errors = {
                exists: true
            };
            rs.poll = {
                question: null,
                choices: []
            };

            /**
             * getUrl
             * grabs url as poll id
             *
             * @param {string} url
             * @return {undefined}
             */
            rs.getUrl = function(url) {
                rs.url = url;
            };

            /**
             * getPollResult
             * ajax request to for results
             *
             * @return {undefined}
             */
            rs.getPollResult = function() {
                rs.errors.exists = true;
                $http.get('/poll/' + rs.url + '/results')
                    .then(function(response) {
                        if (response.data.error) {
                            rs.errors.exists = false;
                            return;
                        }
                        rs.poll.question = response.data.question;
                        rs.poll.choices = response.data.choices;
                        console.log(rs.poll);
                        rs.poll.total = rs.totalVotes(rs.poll);
                    }, function(response) {
                        console.log('ajax error');
                    });
            };

            /**
             * totalVotes
             * returns total number of votes
             *
             * @param {object} data
             * @return {integer}
             */
            rs.totalVotes = function(data) {
                return data.choices.reduce(function(pv, cv) {
                    return pv + cv.vote;
                }, 0);
            };
        }])
        .controller('resultCtrl', ["$location", "resultService", "$routeParams" ,function($location, resultService, $routeParams){
            var rc = this;
            rc.errors = resultService.errors;
            resultService.getUrl($routeParams.id);
            rc.poll = resultService.poll;
            resultService.getPollResult();
        }]);
})();


// poll vote
'use strict';

angular.module('pollApp.pollVote', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/vote/:id', {
            templateUrl: 'vote/vote.html',
            controller: 'pollVoteCtrl',
            controllerAs: 'vc'
        });
    }])
    .controller('pollVoteCtrl', ['voteService', '$routeParams', "$location", '$modal', function(voteService, $routeParams, $location, $modal) {
        var vc = this;

        // holds user choice
        vc.choice = undefined;
        
        // url or id
        vc.id = $routeParams.id;

        // status mesasge on modal
        vc.status = 'Waiting for response...';

        // vote success/fail status
        vc.failed = false;

        // Set url for ajax request
        voteService.setId(vc.id);

        // get poll data
        voteService.getPoll().then(function(response) {
            console.log('ajax success');
            console.log(response);
            if (response.data.error) {
                throw new Error(response.data.error);
            }
            vc.poll = response.data;
            vc.getError = false;
        }).then(null, function(response) {
            console.log('something wrong', response);
            vc.getError = true;
        });
        
        /**
         * toggleChoice
         * sets current choice
         *
         * @param {integer} choice
         * @return {undefined}
         */
        vc.toggleChoice = function(choice) {
            vc.choice = choice;
        };

        /**
         * submitVote
         * submits vote to server via ajax
         * fails without a valid choice
         *
         * @return {undefined}
         */
        vc.submitVote = function() {
            //vc.failed = false;
            if (vc.choice === undefined) {
                vc.failed = true;
                vc.status = 'Need to pick one';
                vc.open();
            } else if (vc.choice !== undefined) {
                voteService.submitVote({id: vc.id, choice: vc.choice})
                    .then(function(response) {
                        console.log(response.data.error);
                        if (response.data.error) {
                            vc.status = response.data.error;
                            throw new Error(response.data.error);
                        }
                        // success
                        vc.status = 'Vote submitted!';
                        vc.failed = false;
                        vc.submitted = true;
                        vc.open();
                    }).then(null, function(response) {
                        // failed
                        if (!vc.status) {
                            vc.status = 'Vote submission failed';
                        }
                        vc.failed = true;
                        vc.open();
                    });
            }
        };

        /**
         * resultsPage
         * 
         * show results page
         *
         * @return {undefined}
         */
        vc.resultsPage = function(){
            var page = "/vote/" + vc.id + "/results";
            $location.path(page);
        };

        vc.open = function(size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'vote/voteModalContent.html',
                controller: 'modalInstanceCtrl',
                constollerAs: 'mi',
                size: size,
                resolve: {
                    items: function() {
                        return {
                            failed: vc.failed,
                            status: vc.status,
                            id: vc.id
                        };
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                console.log('selectedItem: ', selectedItem);
            });
        };
    }]);

'use strict';

angular.module('pollApp.pollVote')
    .service('voteService', ['$http', function($http) {
        var poll = this;

        /**
         * setId
         * url to get poll id for ajax request
         *
         * @param id
         * @return {undefined}
         */
        poll.setId = function(id) {
            poll.id = id;
        };

        /**
         * getPoll
         * ajax request to server api to get poll
         *
         * @return {undefined}
         */
        poll.getPoll = function() {
            return $http.get('/poll/' + poll.id)
                .then(function(response) {
                    return response;
                });
        };

        /**
         * submitVote
         * ajax request to server api to submit vote
         *
         * @param {object} vote
         * @return {undefined}
         */
        poll.submitVote = function(vote) {
            console.log(vote);
            return $http.post('/poll/vote/submit', vote)
                .then(function(response) {
                    return response;
                });
        };
    }]);

(function(){
    'use strict';

    angular.module('pollApp.user', ['ngRoute','ngAnimate','ngMessages'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/user/:user', {
                templateUrl: 'user/user.html',
                controller: 'userCtrl',
                controllerAs:'uc'
            });
        }])
        .controller('userCtrl', ["$location", "userPollService", "$routeParams" ,function($location, userPollService, $routeParams){
            var uc = this;

            var user = $routeParams.user;
            uc.user = user;

            userPollService.getPolls(user)
                .then(function(response) {
                    if (response.data.error) {
                        throw new Error(response.data.error);
                    }
                    if (response.data.polls.length > 0) {
                        // at least one poll found
                        uc.pollList = response.data.polls;
                    }
                    uc.owner = response.data.owner;
                    return response;
                })
                .then(null, function(response) {

                });

            uc.removePoll = function(url, index) {
                userPollService.removePoll(url, uc.user)
                    .then(function(response) {
                        if (response.data.error) {
                            throw new Error(response.data.error);
                        }
                        console.log('server message:', response.data.message);
                        uc.pollList.splice(index, 1);
                        return response;
                    })
                    .then(null, function(response) {

                    });
            };
        }]);
})();


'use strict';

angular.module('pollApp.user')
    .service('userPollService', ['$http', '$window', function($http, $window) {
        var us = this;

        us.getPolls = function(username) {
            return $http.post('/user/polls', {'username': username})
                .then(function(response) {
                    return response;
                });
        };
        us.removePoll = function(url, username) {
            return $http.post('/user/removepoll', {url: url, username: username})
                .then(function(response) {
                    return response;
                });
        };
    }]);
