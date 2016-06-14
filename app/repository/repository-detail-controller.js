'use strict';

/**
 * @ngdoc function
 * @name docker-registry-frontend.controller:RepositoryDetailController
 * @description
 * # RepositoryDetailController
 * Controller of the docker-registry-frontend
 */
angular.module('repository-detail-controller', ['registry-services', 'app-mode-services'])
  .controller('RepositoryDetailController', ['$scope', '$route', '$routeParams', '$location', '$modal', 'Repository', 'AppMode',
  function($scope, $route, $routeParams, $location, $modal, Repository, AppMode){

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    //$scope.searchTerm = $route.current.params.searchTerm;
    $scope.repositoryUser = $route.current.params.repositoryUser;
    $scope.repositoryName = $route.current.params.repositoryName;
    $scope.repository = $scope.repositoryUser + '/' + $scope.repositoryName;

    $scope.appMode = AppMode.query();
    $scope.maxTagsPage = undefined;

    var text = {"user": "library", "name": "registry", "namespace": "library", "status": 1, "description": "Containerized docker registry", "is_private": false, "is_automated": false, "can_edit": false, "star_count": 8
52, "pull_count": 33249269, "last_updated": "2016-05-18T21:41:20.213769Z", "has_starred": false, "full_description": "# Supported tags and respective `Dockerfile` links\n\n-\t[`2`, `2.4`, `2.4.1` (*Dockerfile*)](https://github.com/docker/distribution-library-image/blob/5cbbc8d1e6046cef5938e3380fd2a5fbd854f921/Dockerfile)\n\n[![](https://badge.imagelayers.io/registry:2.svg)](https://imagelayers.io/?images=registry:2)\n\nFor more information about this image and its history, please see [the relevant manifest file (`library/registry`)](https://github.com/docker-library/official-images/blob/master/library/registry). This image is updated via [pull requests to the `docker-library/official-images` GitHub repo](https://github.com/docker-library/official-images/pulls?q=label%3Alibrary%2Fregistry).\n\nFor detailed information about the virtual/transfer sizes and individual layers of each of the above supported tags, please see [the `registry/tag-details.md` file](https://github.com/docker-library/docs/blob/master/registry/tag-details.md) in [the `docker-library/docs` GitHub repo](https://github.com/docker-library/docs).\n\n# Docker Registry\n\nThe tags >= 2 refer to the [new registry](https://github.com/docker/distribution).\n\nOlder tags refer to the [deprecated registry](https://github.com/docker/docker-registry).\n\n## Run the Registry\n\n-\tinstall docker according to the [following instructions](http://docs.docker.io/installation/#installation)\n\n### Run the registry docker container: Quick version\n\n-\trun the registry: `docker run -p 5000:5000 -v <HOST_DIR>:/tmp/registry-dev registry`\n-\tModify your docker startup line/script: add \"-H tcp://127.0.0.1:2375 -H unix:///var/run/docker.sock --insecure-registry <REGISTRY_HOSTNAME>:5000\"\n\n### Recommended: run the registry docker container\n\n```console\n$ docker run \\\n         -e SETTINGS_FLAVOR=s3 \\\n         -e AWS_BUCKET=acme-docker \\\n         -e STORAGE_PATH=/registry \\\n         -e AWS_KEY=AKIAHSHB43HS3J92MXZ \\\n         -e AWS_SECRET=xdDowwlK7TJajV1Y7EoOZrmuPEJlHYcNP2k4j49T \\\n         -e SEARCH_BACKEND=sqlalchemy \\\n         -p 5000:5000 \\\n         registry\n```\n\nNOTE: The container will try to allocate the port 5000. If the port is already taken, find out which container is already using it by running `docker ps`.\n\n# Support\n\nIf you are interested in commercial support, the [Docker Trusted Registry](https://www.docker.com/docker-trusted-registry) provides an image registry, LDAP/Active Directory integration, security certificates, and more in a solution that includes commercial support.\n\n# Supported Docker versions\n\nThis image is officially supported on Docker version 1.11.1.\n\nSupport for older versions (down to 1.6) is provided on a best-effort basis.\n\nPlease see [the Docker installation documentation](https://docs.docker.com/installation/) for details on how to upgrade your Docker daemon.\n\n# User Feedback\n\n## Documentation\n\nDocumentation for this image is stored in the [`registry/` directory](https://github.com/docker-library/docs/tree/master/registry) of the [`docker-library/docs` GitHub repo](https://github.com/docker-library/docs). Be sure to familiarize yourself with the [repository's `README.md` file](https://github.com/docker-library/docs/blob/master/README.md) before attempting a pull request.\n\n## Issues\n\nIf you have any problems with or questions about this image, please contact us through a [GitHub issue](https://github.com/docker/distribution-library-image/issues). If the issue is related to a CVE, please check for [a `cve-tracker` issue on the `official-images` repository first](https://github.com/docker-library/official-images/issues?q=label%3Acve-tracker).\n\nYou can also reach many of the official image maintainers via the `#docker-library` IRC channel on [Freenode](https://freenode.net).\n\n## Contributing\n\nYou are invited to contribute new features, fixes, or updates, large or small; we are always thrilled to receive pull requests, and do our best to process them as fast as we can.\n\nBefore you start to code, we recommend discussing your plans through a [GitHub issue](https://github.com/docker/distribution-library-image/issues), especially for more ambitious contributions. This gives other contributors a chance to point you in the right direction, give you feedback on your design, and help you find out if someone else is working on the same thing.", "permissions": {"read": true, "write": false, "admin": false}};

    var obj = eval(text);
    $scope.description = obj.description;
    $scope.fullDescription = obj.full_description;
    $scope.command = "docker pull " + obj.name;

    // Method used to disable next & previous links
    $scope.getNextHref = function (){
      if($scope.maxTagsPage > $scope.tagsCurrentPage){
        var nextPageNumber = $scope.tagsCurrentPage + 1;
        return '/repository/'+$scope.repository+'/'+ $scope.tagsPerPage +'/' +nextPageNumber;
      }
      return '#'
    } 
    $scope.getFirstHref = function (){
      if($scope.tagsCurrentPage > 1){
        return '/repository/'+$scope.repository+'/' + $scope.tagsPerPage +'/1';
      }
      return '#'
    }
    // selected repos
    $scope.selectedRepositories = [];

    $scope.openConfirmRepoDeletionDialog = function(size) {
      var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'modalConfirmDeleteItems.html',
          controller: 'DeleteRepositoryController',
          size: size,
          resolve: {
            items: function () {
              return $scope.selectedRepositories;
            },
            information: function() {
              return 'A repository is a collection of tags. \
                      A tag is basically a reference to an image. \
                      If no references to an image exist, the image will be scheduled for automatic deletion. \
                      That said, if you remove a tag, you remove a reference to an image. \
                      Your image data may get lost, if no other tag references it. \
                      If you delete a repository, you delete all tags associated with it. \
                      Are you sure, you want to delete the following repositories?';
            }
          }
      });
    };

  }]);
