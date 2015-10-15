(function () {
  angular.module( 'lk.home', [
    'ui.router.state',
    'lk.authentication'
  ])



  .config(config)
  .controller('HomeCtrl', HomeCtrl)
  .directive('graph', graph);



  config.$inject = ['$stateProvider'];

  function config ($stateProvider) {
    $stateProvider.state( 'home', {
      url: '/',
      views: {
        "main": {
          controller: 'HomeCtrl',
          controllerAs: 'vm',
          templateUrl: 'home/home.tpl.html'
        }
      }
    });
  }


  HomeCtrl.$inject = ['$scope'];
  function HomeCtrl ($scope) {
    var vm = this;
    vm.title = "Welcome to the home page!";
    vm.test = null;
    
    $scope.points = [
      {x: 0, y: 0},
    ];

    $scope.counter = 2;
      
    $scope.addPoint = function() {
      $scope.points.push({x: 0, y: 0});
      $scope.counter++;
    };

    vm.polygonArea = function() {
      var points = $scope.points;
      var numPoints = points.length;
      var xPoints = [];
      var yPoints = [];
      var area = 0;

      points.forEach(function(point) {
        xPoints.push(point.x);
        yPoints.push(point.x);
      });

      j = numPoints - 1;

      for (i=0; i < numPoints; i++) { 
        area = area +  (xPoints[j] + xPoints[i]) * (yPoints[j] - yPoints[i]); 
        j = i;
      }
      vm.area = area / 2;
    };

    $scope.drawPolygon = function() {
      vm.draw();
      vm.polygonArea();
    };

    vm.clear = function() {
      $scope.points = [
        {x: 0, y: 0},
      ];
      $scope.counter = 2;
      vm.area = 0;
      document.getElementById('chart').innerHTML = '';
    };

    vm.update = function(funct) {
      vm.draw = funct;
    };


    vm.submitData = function(valid) {
      if (valid) {

      } else {
        $scope.error = 'Form Invalid, please fill out all fields';
      }
    };

  }


  graph.$inject = ['$window'];
  function graph($window) {
    return {
      restrict: 'EA',
      template: "<svg id='chart' class='chart' width='850' height='200'></svg>",
      scope: {
        data: '=',
        update: '&'
      },
      link: function(scope, elem, attrs) {
       var padding = 20;
       var data, xScale, yScale, xAxisGen, yAxisGen, lineFun;

       var d3 = $window.d3;
       var element = elem.find('svg');
       var svg = d3.select(element[0]);

       function setChartParameters() {
          data = scope.data;
          scaleX = d3.scale.linear()
                 .domain([-30,30])
                 .range([0,600]);

           scaleY = d3.scale.linear()
                   .domain([0,50])
                   .range([500,0]);
       }
     
       function drawChart() {
         setChartParameters();
         svg.selectAll('polygon').data([data]).enter()
          .append('polygon')
          .attr('points', function(d) {
            return d.map(function(d) {
              return [d.x, d.y].join(",");
            }).join(" ");
          })
          .style('fill', 'brown');
         }

         scope.update({funct: drawChart});
      }
    };
  }

})();