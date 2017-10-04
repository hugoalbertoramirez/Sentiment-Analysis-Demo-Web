function sentimentAnalysis(video, canvas, divGraph, divAreaGraph) {
  var photoContext = canvas.getContext('2d');
  photoContext.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  var url_image = canvas.toDataURL('image/png');
  sendBase64ToServer(url_image, divGraph, divAreaGraph);
}

var url_client = "http://127.0.0.1:8887";
var url_server = "http://35.164.189.183:8088/uploadImage"

function sendBase64ToServer(url_image, divGraph, divAreaGraph) {
  var form = new FormData();
 
  form.append("img", url_image);
  
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": url_server,
    "method": "POST",
    
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
    "data": form
  }
  
  $.ajax(settings).done(function (res) {
    var emos = JSON.parse(res);
    console.log("Response >> " + res);
    pieGraph(emos[0].scores, divGraph, divAreaGraph);
  });
};

var list_charts = [];

function pieGraph(scores, divGraph, divAreaGraph) {

  Highcharts.chart(divGraph.id, {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Sentiment analysis'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                },
                connectorColor: 'silver'
            }
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [
          { name : "Anger", y: scores.anger }, 
          { name : 'Contempt', y: scores.contempt }, 
          { name : "Disgust", y: scores.disgust },
          { name : "Fear", y: scores.fear },
          { name : "Happiness", y: scores.happiness },
          { name : "Neutral", y: scores.neutral },
          { name : "Sadness", y: scores.sadness },
          { name : "Surprise", y : scores.surprise }
       ]
    }]
  });

  if (divAreaGraph.firstChild == null)
  {
    var h = Highcharts.chart(divAreaGraph.id, {
      chart: {
          type: 'area'
      },
      title: {
          text: 'Historic sentiment analysis'
      },
      subtitle: {
          text: 'Source: Wikipedia.org'
      },
      xAxis: {
          categories: [],
          tickmarkPlacement: 'on',
          title: {
              enabled: false
          }
      },
      yAxis: {
          title: {
              text: 'Percent'
          }
      },
      tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
          split: true
      },
      plotOptions: {
          area: {
              stacking: 'percent',
              lineColor: '#ffffff',
              lineWidth: 1,
              marker: {
                  lineWidth: 1,
                  lineColor: '#ffffff'
              }
          }
      },
      series: [
        { name: "Anger", data: [scores.anger, scores.anger] }, 
        { name: 'Contempt', data: [scores.contempt, scores.contempt] }, 
        { name : "Disgust", data: [scores.disgust, scores.disgust] }, 
        { name : "Fear", data: [scores.fear, scores.fear] }, 
        { name : "Happiness", data: [scores.happiness, scores.happiness] }, 
        { name : "Neutral", data: [scores.neutral, scores.neutral] }, 
        { name : "Sadness", data: [scores.sadness, scores.sadness] }, 
        { name : "Surprise", data: [scores.surprise, scores.surprise] }, 
      ]
    }); 

    h.id = divAreaGraph.id;
    list_charts.push(h);
  }
  else
  {
    var chartTime = list_charts.find(function findId(chart) { 
      return chart.id === divAreaGraph.id;
    });


    shift = chartTime.series[0].data.length > 20; 
    
    chartTime.series[0].addPoint(scores.anger, true, shift);
    chartTime.series[1].addPoint(scores.contempt, true, shift);
    chartTime.series[2].addPoint(scores.disgust, true, shift);
    chartTime.series[3].addPoint(scores.fear, true, shift);
    chartTime.series[4].addPoint(scores.happiness, true, shift);
    chartTime.series[5].addPoint(scores.neutral, true, shift);
    chartTime.series[6].addPoint(scores.sadness, true, shift);
    chartTime.series[7].addPoint(scores.surprise, true, shift);
  }

}