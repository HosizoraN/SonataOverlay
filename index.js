import WebSocketManager from './js/socket.js';
import CanvasKeys from './js/canvas.js';

const socket = new WebSocketManager('127.0.0.1:24050');

const cache = {};

const keys = {
    k1: new CanvasKeys({
      canvasID: 'k1',
    }),
    k2: new CanvasKeys({
      canvasID: 'k2',
    }),
    m1: new CanvasKeys({
      canvasID: 'm1',
    }),
    m2: new CanvasKeys({
      canvasID: 'm2',
    }),
  };

const score = new CountUp('score', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: "." })
const acc = new CountUp('acc', 0, 0, 2, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "%" })
const h100 = new CountUp('h100', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })
const h50 = new CountUp('h50', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })
const h0 = new CountUp('h0', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })
const hSB = new CountUp('hSB', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })

let progressbar;
let rankingPanelSet;
let fullTime;
let seek;
let onepart;
let smoothOffset = 2;
let smoothed;
let tickPos;
let tempAvg;
let tempSmooth;
let currentErrorValue;
let tempHitErrorArrayLength;
let error_h300 = 83;
let error_h100 = 145;

let leaderboardFetch;
let tempSlotLength;
let tempMapScores = [];
let playerPosition;

let tick = [];
for (var t = 0; t < 200; t++) {
    tick[t] = document.querySelectorAll("[id^=tick]")[t];
}

function calculate_od(temp) {
    error_h300 = 83 - (6 * temp);
    error_h100 = 145 - (8 * temp);
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

window.onload = function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);

    var ctxSecond = document.getElementById("canvasSecond").getContext("2d");
    window.myLineSecond = new Chart(ctxSecond, configSecond);
};

socket.sendCommand('getSettings', encodeURI(window.COUNTER_PATH));
socket.commands((data) => {
    try {
      const { command, message } = data;
      // get updates for "getSettings" command
      if (command == 'getSettings') {
        console.log(command, message); // print out settings for debug
      };

      if (cache['LBEnabled'] != message['LBEnabled']) {
        cache['LBEnabled'] = message['LBEnabled'];
      };

      if (cache['LBOptions'] != message['LBOptions']) {
        cache['LBOptions'] = message['LBOptions'];
      };

      if (message['Recorder'] != null) {
        document.getElementById("recorderName").innerHTML = `${message['Recorder']}`;
        document.getElementById("resultRecorder").innerHTML = `Recorder: ` + `${message['Recorder']}`;
      };
      if (cache['ColorSet'] != message['ColorSet']) {
        cache['ColorSet'] = message['ColorSet'];
      };

      if (cache['ColorSet'] == `Manual`) {
        const ColorData1 = `${message['HueID']}, ${message['SaturationID']}%, 50%`;
        const ColorData2 = `${message['HueID2']}, ${message['SaturationID2']}%, 50%`;

        document.getElementById("lefthp1").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp2").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp3").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp4").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp5").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp6").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp7").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp8").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp9").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp10").style.fill = `hsl(${ColorData1})`;

        document.getElementById("righthp1").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp2").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp3").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp4").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp5").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp6").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp7").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp8").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp9").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp10").style.fill = `hsl(${ColorData2})`;

        smallStats.style.backgroundColor = `hsl(${ColorData1})`;

        combo_box.style.backgroundColor = `hsl(${ColorData1})`;
        combo_box.style.filter = `drop-shadow(0 0 10px hsla(${ColorData1}))`;

        pp_box.style.backgroundColor = `hsl(${ColorData2})`;
        pp_box.style.filter = `drop-shadow(0 0 10px hsla(${ColorData2}))`;

        document.querySelector('.keys.k1').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.k2').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.m1').style.setProperty('--press', `hsl(${ColorData2})`);
        document.querySelector('.keys.m2').style.setProperty('--press', `hsl(${ColorData2})`);

        keys.k1.color = `hsla(${ColorData1}, 0.8)`;
        keys.k2.color = `hsla(${ColorData1}, 0.8)`;
        keys.m1.color = `hsla(${ColorData2}, 0.8)`;
        keys.m2.color = `hsla(${ColorData2}, 0.8)`;

        config.data.datasets[0].backgroundColor = `hsl(${ColorData1}, 0.2)`;
        configSecond.data.datasets[0].backgroundColor = `hsl(${ColorData1})`;

        rBPM.style.backgroundColor = `hsl(${ColorData1})`;
        rBPM.style.boxShadow = `0 0 5px 2px hsl(${ColorData1})`;

        lbcpLine.style.backgroundColor = `hsl(${ColorData1})`;
        lbcpLine.style.boxShadow = `0 0 10px 2px hsla(${ColorData1}, 0.5)`;
      };

      if (message['PromotionEnabled'] == true) {
        qc.style.display = `flex`;
        brand.classList.add(`brandsmall`);
      }
      else {
        qc.style.display = `none`;
        brand.classList.remove(`brandsmall`);
      }

    } catch (error) {
      console.log(error);
    };
  });
  
  socket.api_v1(({ menu }) => {
	if (menu.pp.strains) smoothed = smooth(menu.pp.strains, smoothOffset);
    config.data.datasets[0].data = smoothed;
    config.data.labels = smoothed;
    configSecond.data.datasets[0].data = smoothed;
    configSecond.data.labels = smoothed;
    if (window.myLine && window.myLineSecond) {
        window.myLine.update();
        window.myLineSecond.update();
    }
  });
  
  socket.api_v2(({ play, beatmap, state, resultsScreen, settings, files, folders }) => {
    try {
        
        if (cache['showInterface'] != settings.interfaceVisible) {
            cache['showInterface'] = settings.interfaceVisible;
        };
        if (cache['data.menu.state'] != state.number || cache['data.menu.state.name'] != state.name) {
            cache['data.menu.state'] = state.number;
            cache['data.menu.state.name'] = state.name;
        };
        if (cache['mode'] != play.mode.name) {
            cache['mode'] = play.mode.name;
            global.style.backgroundImage = `url(./static/mode/${cache['mode']}.png)`;
        };
        if (cache['hp.smooth'] != play.healthBar.smooth.toFixed(2)) {
            cache['hp.smooth'] = play.healthBar.smooth.toFixed(2);
        };
        if (cache['play.name'] != play.playerName) {
            cache['play.name'] = play.playerName;
            username.innerHTML = cache['play.name'];
            lbcpName.innerHTML = cache['play.name'];
            setupUser(play.playerName);
        };
        if (cache['play.rank.current'] != play.rank.current) {
            cache['play.rank.current'] = play.rank.current;
            lbcpRanking.innerHTML = cache['play.rank.current'].replace("H", "");
            lbcpRanking.setAttribute('class', `${play.rank.current}`);
        }
        if (cache['play.accuracy'] != play.accuracy.toFixed(2)) {
            cache['play.accuracy'] = play.accuracy.toFixed(2);
            lbcpAcc.innerHTML = cache['play.accuracy'] + `%`;
            acc.innerHTML = cache['play.accuracy'];
            acc.update(cache['play.accuracy']);
        };
        if (cache['play.score'] != play.score) {
            cache['play.score'] = play.score;
	        tempAvg = 0;
            lbcpScore.innerHTML = numberWithCommas(cache['play.score']);
            score.innerHTML = cache['play.score'];
            score.update(cache['play.score']);
        };
        if (cache['play.combo.current'] != play.combo.current) {
            cache['play.combo.current'] = play.combo.current;
            combo_count.innerHTML = cache['play.combo.current'];
        };
        if (cache['play.combo.max'] != play.combo.max) {
            cache['play.combo.max'] = play.combo.max;
            lbcpCombo.innerHTML = cache['play.combo.max'] + `x`;
            combo_max.innerHTML = ` / ` + cache['play.combo.max'] + `x`;
        };
        if (cache['play.pp.current'] != play.pp.current.toFixed(0)) {
            cache['play.pp.current'] = play.pp.current.toFixed(0);
            lbcpPP.innerHTML = cache['play.pp.current'] + `pp`;
            pp_txt.innerHTML = cache['play.pp.current'];
        };
        if (cache['play.pp.fc'] != play.pp.fc.toFixed(0)) {
            cache['play.pp.fc'] = play.pp.fc.toFixed(0);
            ppfc_txt.innerHTML = cache['play.pp.fc'];
        };
        if (cache['unstableRate'] != play.unstableRate) {
            cache['unstableRate'] = play.unstableRate;
            URIndex.innerHTML = cache['unstableRate'].toFixed(0);
            ResultUR.innerHTML = cache['unstableRate'].toFixed(2) + ' UR';
        };
        if (cache['beatmap_rankedStatus'] != beatmap.status.number) {
            cache['beatmap_rankedStatus'] = beatmap.status.number;

            switch (cache['beatmap_rankedStatus']) {
                case 4:
                    rankedStatus.style.backgroundImage = `url('./static/state/ranked.png')`;
                    break;
                case 7:
                    rankedStatus.style.backgroundImage = `url('./static/state/loved.png')`;
                    break;
                case 5:
                case 6:
                    rankedStatus.style.backgroundImage = `url('./static/state/qualified.png')`;
                    break;
                default:
                    rankedStatus.style.backgroundImage = `url('./static/state/unranked.png')`;
                    break;
            }
        };
        if (cache['beatmap.stats.ar.converted'] != beatmap.stats.ar.converted) {
            cache['beatmap.stats.ar.converted'] = beatmap.stats.ar.converted;
            rAR.innerHTML = cache['beatmap.stats.ar.converted'].toFixed(2);
        };
        if (cache['beatmap.stats.cs.converted'] != beatmap.stats.cs.converted) {
            cache['beatmap.stats.cs.converted'] = beatmap.stats.cs.converted;
            rCS.innerHTML = cache['beatmap.stats.cs.converted'].toFixed(2);
        };
        if (cache['beatmap.stats.od.converted'] != beatmap.stats.od.converted) {
            cache['beatmap.stats.od.converted'] = beatmap.stats.od.converted;
            rOD.innerHTML = cache['beatmap.stats.od.converted'].toFixed(2);
            calculate_od(cache['beatmap.stats.od.converted']);
        };
        if (cache['beatmap.stats.hp.converted'] != beatmap.stats.hp.converted) {
            cache['beatmap.stats.hp.converted'] = beatmap.stats.hp.converted;
            rHP.innerHTML = cache['beatmap.stats.hp.converted'].toFixed(2);
        };
        if (cache['stars.live'] != beatmap.stats.stars.live || cache['stars.total'] != beatmap.stats.stars.total) {
            cache['stars.live'] = beatmap.stats.stars.live;
            cache['stars.total'] = beatmap.stats.stars.total;
            starsCurrent.innerHTML = cache['stars.live'];
            SR.innerHTML = cache['stars.total'];
        };
        if (cache['beatmap.stats.bpm.common'] != beatmap.stats.bpm.common) {
            cache['beatmap.stats.bpm.common'] = beatmap.stats.bpm.common;
            rBPM.innerHTML = cache['beatmap.stats.bpm.common'] + ` BPM`;
        };
        if (cache['beatmap.artist'] != beatmap.artist) {
            cache['beatmap.artist'] = beatmap.artist;
        };
        if (cache['beatmap.title'] != beatmap.title) {
            cache['beatmap.title'] = beatmap.title;
        };
        if (cache['beatmap.mapper'] != beatmap.mapper) {
            cache['beatmap.mapper'] = beatmap.mapper;
        };
        if (cache['beatmap.time.live'] != beatmap.time.live) {
            cache['beatmap.time.live'] = beatmap.time.live;
        };
        if (cache['beatmap.version'] != beatmap.version) {
            cache['beatmap.version'] = beatmap.version;
        };
        if (cache['beatmap.time.firstObject'] != beatmap.time.firstObject) {
            cache['beatmap.time.firstObject'] = beatmap.time.firstObject;
        };
        if (cache['beatmap.time.lastObject'] != beatmap.time.lastObject) {
            cache['beatmap.time.lastObject'] = beatmap.time.lastObject;
        };
        if (cache['beatmap.time.mp3Length'] != beatmap.time.mp3Length) {
            cache['beatmap.time.mp3Length'] = beatmap.time.mp3Length;
        };
        if (cache['beatmap.id'] != beatmap.id) {
            cache['beatmap.id'] = beatmap.id;
        };
        if (cache['h100'] != play.hits['100']) {
            cache['h100'] = play.hits['100'];
            h100.update(cache['h100']);
            h100Text.innerHTML = cache['h100'] + 'x';
            let tickh100 = document.createElement("div");
            tickh100.setAttribute("class", "tickGraph tick100");
            tickh100.style.transform = `translateX(${progressbar}px)`;
            if (cache['h100'] > 0) {
                graph100.style.height = "17px";
                document.getElementById("graph100").appendChild(tickh100);
            }
            else {
                graph100.style.height = "0px";
            }
            h100Cont.style.backgroundColor = `rgb(0, 255, 47)`;
            h100Text.style.color = `rgb(0, 255, 47)`;
            h100Text.style.transform = `scale(85%)`;
            setTimeout(function () {
                h100Cont.style.backgroundColor = `#27b641`;
                h100Text.style.color = `white`;
                h100Text.style.transform = `scale(100%)`;
            }, 200);
        };
  
        if (cache['h50'] != play.hits['50']) {
            cache['h50'] = play.hits['50'];
            h50.update(cache['h50']);
            h50Text.innerHTML = cache['h50'] + 'x';
            let tickh50 = document.createElement("div");
            tickh50.setAttribute("class", "tickGraph tick50");
            tickh50.style.transform = `translateX(${progressbar}px)`;
            if (cache['h50'] > 0) {
                graph50.style.height = "17px";
                document.getElementById("graph50").appendChild(tickh50);
            }
            else {
                graph50.style.height = "0px";
            }
            h50Cont.style.backgroundColor = `rgb(255, 145, 0)`;
            h50Text.style.color = `rgb(255, 145, 0)`;
            h50Text.style.transform = `scale(85%)`;
            setTimeout(function () {
                h50Cont.style.backgroundColor = `#b87f34`;
                h50Text.style.color = `white`;
                h50Text.style.transform = `scale(100%)`;
            }, 200);
        };
    
        if (cache['h0'] != play.hits['0']) {
            cache['h0'] = play.hits['0'];
            h0.update(cache['h0']);
            h0Text.innerHTML = cache['h0'] + 'x';
            let tickh0 = document.createElement("div");
            tickh0.setAttribute("class", "tickGraph tick0");
            tickh0.style.transform = `translateX(${progressbar}px)`;
            if (cache['h0'] > 0) {
                graph0.style.height = "17px";
                document.getElementById("graph0").appendChild(tickh0);
            }
            else {
                graph0.style.height = "0px";
            }
            h0Cont.style.backgroundColor = `rgb(255, 0, 4)`;
            h0Text.style.color = `rgb(255, 0, 4)`;
            h0Text.style.transform = `scale(85%)`;
            setTimeout(function () {
                h0Cont.style.backgroundColor = `#b83133`;
                h0Text.style.color = `white`;
                h0Text.style.transform = `scale(100%)`;
            }, 200);
        };
  
        if (cache['hSB'] !== play.hits.sliderBreaks) {
            cache['hSB'] = play.hits.sliderBreaks;
            hSB.update(cache['hSB']);
            hSBText.innerHTML = cache['hSB'] + 'x';
            rSB.innerHTML = cache['hSB'];
            let tickSB = document.createElement("div");
            tickSB.setAttribute("class", "tickGraph tickSB");
            tickSB.style.transform = `translateX(${progressbar}px)`;
            if (cache['hSB'] > 0) {
                graphSB.style.height = "17px";
                document.getElementById("graphSB").appendChild(tickSB);
            }
            else {
                graphSB.style.height = "0px";
            }
            hsbCont.style.backgroundColor = `white`;
            hSBText.style.transform = `scale(85%)`;
            setTimeout(function () {
                hsbCont.style.backgroundColor = `#b8b8b8`;
                hSBText.style.transform = `scale(100%)`;
            }, 200);
        };
        if (cache['play.mods.name'] != play.mods.name || cache['play.mods.number'] != play.mods.number) {
            cache['play.mods.name'] = play.mods.name;
            cache['play.mods.number'] != play.mods.number;
        };
        if (cache['resultsScreen.hits[300]'] != resultsScreen.hits[300]) {
            cache['resultsScreen.hits[300]'] = resultsScreen.hits[300];
            r100.innerHTML = cache['resultsScreen.hits[300]'];
        };
        if (cache['resultsScreen.hits[100]'] != resultsScreen.hits[100]) {
            cache['resultsScreen.hits[100]'] = resultsScreen.hits[100];
            r100.innerHTML = cache['resultsScreen.hits[100]'];
        };
        if (cache['resultsScreen.hits[50]'] != resultsScreen.hits[50]) {
            cache['resultsScreen.hits[50]'] = resultsScreen.hits[50];
            r50.innerHTML = cache['resultsScreen.hits[50]'];
        };
        if (cache['resultsScreen.hits[0]'] != resultsScreen.hits[0]) {
            cache['resultsScreen.hits[0]'] = resultsScreen.hits[0];
            r0.innerHTML = cache['resultsScreen.hits[0]'];
        };
        if (cache['resultsScreen.name'] != resultsScreen.name) {
            cache['resultsScreen.name'] = resultsScreen.name;
            rUsername.innerHTML = cache['resultsScreen.name'];
        };
        if (cache['resultsScreen.mods.name'] != resultsScreen.mods.name || cache['resultsScreen.mods.number'] != resultsScreen.mods.number) {
            cache['resultsScreen.mods.name'] = resultsScreen.mods.name;
            cache['resultsScreen.mods.number'] = resultsScreen.mods.number;
        };
        if (cache['resultScreen.accuracy'] != resultsScreen.accuracy) {
            cache['resultScreen.accuracy'] = resultsScreen.accuracy;
            ResultAcc.innerHTML = cache['resultScreen.accuracy'] + '%';
        };
        if (cache['resultsScreen.maxCombo'] != resultsScreen.maxCombo) {
            cache['resultsScreen.maxCombo'] = resultsScreen.maxCombo;
        };
        if (cache['resultsScreen.score'] != resultsScreen.score) {
            cache['resultsScreen.score'] = resultsScreen.score;
            ResultScoreCombo.innerHTML = numberWithCommas(cache['resultsScreen.score']) + ` (${cache['resultsScreen.maxCombo']}x)`;
        };
        if (cache['resultsScreen.rank'] != resultsScreen.rank) {
            cache['resultsScreen.rank'] = resultsScreen.rank;
            rankingResult.innerHTML = cache['resultsScreen.rank'].replace("H", "");
            rankingResult.setAttribute('class', `${resultsScreen.rank}`);
        };
        if (cache['folders.beatmap'] != folders.beatmap) {
            cache['folders.beatmap'] = folders.beatmap;
        };
        if (cache['files.beatmap'] != files.beatmap) {
            cache['files.beatmap'] = files.beatmap;
        };
        if (cache['files.background'] != files.background) {
            cache['files.background'] = files.background;
        };

        const cache_beatmap = ' ';

        if (cache_beatmap !== beatmap.checksum) {
            cache_beatmap == beatmap.checksum;
    
            MapReader(
                `http://127.0.0.1:24050/files/beatmap/${cache['folders.beatmap']}/${cache['files.beatmap']}`,
                beatmap.time.live
            );
            async function MapReader(path, currentTime) {
                const reader = await fetch(path, { cache: "no-store" });
                const text = await reader.text();
                const matchTimingPoints = text
                    .match(/\[TimingPoints\](\r?)\n(-?[0-9]+,-?[0-9]+(\.[0-9]+)?,[0-9]+,[0-9]+,[0-9]+,[0-9]+,(0|1),[0-9]+(\r)?\n)*/gm)
                    .shift();
    
                const timingPointsList = matchTimingPoints.match(/(-?[0-9]+,-?[0-9]+(\.[0-9]+)?,[0-9]+,[0-9]+,[0-9]+,[0-9]+,1,[0-9]+)/g).map((point) => {
                    const params = point.split(",");
                    return {
                        time: parseInt(params[0]),
                        BPM: 60000 / parseFloat(params[1]),
                    };
                });
                
                let BPMLive;
                
                if (cache['play.mods.name'].search("DT") !== -1 || cache['play.mods.name'].search("NC") !== -1) {
                    BPMLive = timingPointsList.findLast((point) => point.time <= currentTime)?.BPM.toFixed(0) * 1.5;
                }
                else if (cache['play.mods.name'].search("HT") !== -1) {
                    BPMLive = timingPointsList.findLast((point) => point.time <= currentTime)?.BPM.toFixed(0) * 0.75;
                }
                else {
                    BPMLive = timingPointsList.findLast((point) => point.time <= currentTime)?.BPM.toFixed(0);
                };
                
                if (cache['BPMLive'] != BPMLive) {
                    cache['BPMLive'] = BPMLive;
                    BPMlive.innerHTML = cache['BPMLive'];
                    bpmflash.style.opacity = 0;
                    setTimeout(function() {
                        bpmflash.style.opacity = 1;
                    }, 200);
                };
            };
        };

        const cachedim = settings.background.dim / 100;
        const Folder = cache['folders.beatmap'].replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27").replace(/ /g, "%20");
        const Img = cache['files.background'];

        mapBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${cachedim}), rgba(0, 0, 0, ${cachedim})), url('http://127.0.0.1:24050/files/beatmap/${Folder}/${Img}')`;
        rankingPanelBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${cachedim}), rgba(0, 0, 0, ${cachedim})), url('http://127.0.0.1:24050/files/beatmap/${Folder}/${Img}')`;
        MapDetails.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('http://127.0.0.1:24050/files/beatmap/${Folder}/${Img}')`;

        SongTitle.innerHTML = cache['beatmap.artist'] + ' - ' + cache['beatmap.title'];
        rDiff.innerHTML = `[${cache['beatmap.version']}]`;
        rMapper.innerHTML = `Mapped by ${cache['beatmap.mapper']}`;

        combo_wrapper.style.transform = `translateX(${cache['beatmap.stats.od.converted'] * 13}px)`;
        pp_wrapper.style.transform = `translateX(-${cache['beatmap.stats.od.converted'] * 13}px)`;
        l50.style.width = `${600 - (25.5 * cache['beatmap.stats.od.converted'])}px`;
        l100.style.width = `${420 - (21.5 * cache['beatmap.stats.od.converted'])}px`;
        l300.style.width = `${240 - (17 * cache['beatmap.stats.od.converted'])}px`;

        document.getElementById('k1').setAttribute('width', `400px`);
        document.getElementById('k2').setAttribute('width', `400px`);
        document.getElementById('m1').setAttribute('width', `400px`);
        document.getElementById('m2').setAttribute('width', `400px`);

        document.getElementById('k1').setAttribute('height', `54px`);
        document.getElementById('k2').setAttribute('height', `54px`);
        document.getElementById('m1').setAttribute('height', `54px`);
        document.getElementById('m2').setAttribute('height', `54px`);

        keys.k1.updateCanvas();
        keys.k2.updateCanvas();
        keys.m1.updateCanvas();
        keys.m2.updateCanvas();

        if (cache['data.menu.state'] !== 2) {
            if (cache['data.menu.state'] !== 7) { deRankingPanel() };
  
            gptop.style.opacity = 0;
    
            URCont.style.opacity = 0;
            avgHitError.style.transform = "translateX(0)";
    
            gpbottom.style.opacity = 0;
    
            URIndex.innerHTML = "";
        } else {
            deRankingPanel();

            if (cache['beatmap_rankedStatus'] == 4 && cache['LBEnabled'] == true || cache['beatmap_rankedStatus'] == 7 && cache['LBEnabled'] == true || cache['beatmap_rankedStatus'] == 6 && cache['LBEnabled'] == true || cache['beatmap_rankedStatus'] == 5 && cache['LBEnabled'] == true ) {
                smallStats.style.transform = `translateY(0)`;
                lbcpPosition.innerHTML = `${playerPosition}`;
            }
            else {
                smallStats.style.transform = `translateY(590px)`;
                lbcpPosition.innerHTML = `0`;
            };
            
            gptop.style.opacity = 1;
            gpbottom.style.opacity = 1;
            URCont.style.opacity = 1;
        }

        if (cache['data.menu.state'] == 7) {
            if (cache[`key-k1-r`]) document.querySelector(`.keys.k1`).classList.remove('hidden');
            if (cache[`key-k2-r`]) document.querySelector(`.keys.k2`).classList.remove('hidden');
            if (cache[`key-m1-r`]) document.querySelector(`.keys.m1`).classList.remove('hidden');
            if (cache[`key-m2-r`]) document.querySelector(`.keys.m2`).classList.remove('hidden');
          };
      
      
          if (cache['data.menu.state'] != 2 && cache['data.menu.state'] != 7) {
            document.querySelectorAll('.tick100').forEach(e => e.remove());
            document.querySelectorAll('.tick50').forEach(e => e.remove());
            document.querySelectorAll('.tick0').forEach(e => e.remove());
            document.querySelectorAll('.tickSB').forEach(e => e.remove());

            smallStats.style.transform = `translateY(590px)`;

            leaderboardFetch = false;
            lbopCont.innerHTML = "";
            lbcpPosition.innerHTML = "";
            document.getElementById("currentplayerCont").style.transform = `none`;
            document.getElementById("lbcpLine").style.transform = `none`;

            delete cache[`key-k1-active`];
            delete cache[`key-k2-active`];
            delete cache[`key-m1-active`];
            delete cache[`key-m2-active`];
      
            document.querySelector(`.keys.k1`).classList.add('hidden');
            document.querySelector(`.keys.k2`).classList.add('hidden');
            document.querySelector(`.keys.m1`).classList.add('hidden');
            document.querySelector(`.keys.m2`).classList.add('hidden');
          };
        
        if (cache['data.menu.state'] == 2) {
    
            if (cache['showInterface'] == true && cache['data.menu.state'] == 2) {
                gptop.style.opacity = 0;
            } else {
                gptop.style.opacity = 1;
            };

            if (cache['LBEnabled'] == true) {

            setupMapScores(cache['beatmap.id']);

            if (document.getElementById("currentplayerCont"))
                lbcpPosition.setAttribute('class', `N${playerPosition}`);

                if (playerPosition > 9) {
                    lbopCont.style.transform = `translateY(${-(playerPosition - 50) * 65}px)`;
                    document.getElementById("currentplayerCont").style.transform = `none`;
                    document.getElementById("lbcpLine").style.transform = `none`;
                } else {
                    lbopCont.style.transform = "translateY(2600px)";
                    document.getElementById("currentplayerCont").style.transform = `translateY(${(playerPosition - 10) * 65}px)`;
                    document.getElementById("lbcpLine").style.transform = `translateY(${(playerPosition - 10) * 65}px)`;
                    document.getElementById("lbcpLine").style.height = `${(playerPosition) * 62}px`;
                    setTimeout(function() {
                        document.getElementById("lbcpLine").style.height = `35px`;
                    }, 300)
                };
            if (tempSlotLength > 0)
                for (var i = 1; i <= tempSlotLength; i++) {
                    if (i >= playerPosition && playerPosition !== 0 && document.getElementById(`playerslot${i}`)) {
                        document.getElementById(`playerslot${i}`).style.transform = `translateY(65px)`;
                    };
                };
            }
            else {
                lbopCont.innerHTML = " ";
                leaderboardFetch = false;
            };
        };

        document.getElementById("modContainer").innerHTML = " ";
        document.getElementById("lbcpMods").innerHTML = " ";

        let modsCount = cache['play.mods.name'].length;
        let modsCount2 = cache['resultsScreen.mods.name'].length;

        for (var i = 0; i < modsCount2; i++) {
            if (cache['resultsScreen.mods.name'].substr(i, 2) !== " ") {
                let mods = document.createElement("div");
                mods.id = cache['resultsScreen.mods.name'].substr(i, 2);
                mods.setAttribute("class", `mods ${cache['resultsScreen.mods.name'].substr(i, 2)}`);
                mods.style.backgroundImage = `url('./static/mods/${cache['resultsScreen.mods.name'].substr(i, 2)}.png')`;
                document.getElementById("modContainer").appendChild(mods);
                i++
            };
        };

        for (var i = 0; i < modsCount; i++) {
            if (cache['play.mods.name'].substr(i, 2) !== " ") {
                let modslb = document.createElement("div");
                modslb.id = cache['play.mods.name'].substr(i, 2);
                modslb.setAttribute("class", `modslb ${cache['play.mods.name'].substr(i, 2)}`);
                modslb.style.backgroundImage = `url('./static/mods/${cache['play.mods.name'].substr(i, 2)}.png')`;
                document.getElementById("lbcpMods").appendChild(modslb);
                i++;
            };
        };

        if (cache['resultsScreen.mods.name'] == " ") {
            rankingResult.style.transform = `translateY(35px)`;
        }
        else {
            rankingResult.style.transform = `translateY(0)`;
        };

        if (cache['h100'] > 0 || cache['h50'] > 0 || cache['h0'] > 0) {
            strainGraph.style.transform = `translateY(-10px)`;
        }
        else {
            strainGraph.style.transform = `translateY(0)`;
        };

        if (fullTime !== cache['beatmap.time.mp3Length']) {
            fullTime = cache['beatmap.time.mp3Length'];
            onepart = 490 / fullTime;
        };
        if (fullTime !== cache['beatmap.time.mp3Length']){
            fullTime = cache['beatmap.time.mp3Length'];
            onepart = 1400/fullTime;
        };
        if (seek !== cache['beatmap.time.live'] && fullTime !== undefined && fullTime !== 0) {
            seek = cache['beatmap.time.live'];
            progressbar = onepart * seek / 1.29;
            progress.style.width = progressbar + 'px';
            progress100.style.transform = `translateX(${progressbar}px)`
            progress50.style.transform = `translateX(${progressbar}px)`
            progress0.style.transform = `translateX(${progressbar}px)`
            progressSB.style.transform = `translateX(${progressbar}px)`
        };

        if (cache['beatmap.time.live'] >= cache['beatmap.time.firstObject'] + 5000 && cache['beatmap.time.live'] <= cache['beatmap.time.firstObject'] + 11900 && cache['data.menu.state'] == 2) {
            recorder.style.transform = "translateX(-600px)";
            if (cache['beatmap.time.live'] >= cache['beatmap.time.firstObject'] + 5500) recorderName.style.transform = "translateX(-600px)";
        } else {
            recorder.style.transform = "none";
            recorderName.style.transform = "none";
        };

        let isBreak = cache['play.combo.current'] < cache['play.combo.max'];

        if (isBreak) {
          combo_text2.style.transform = `translateX(-${getTranslateValue(cache['play.combo.current']) + 15}px)`;
          combo_text.style.transform = `translateX(-${getMaxPxValue(cache['play.combo.max']) - 20}px)`;
          combo_max.style.opacity = 1;
          combo_x.style.display = 'none';
        } else {
          combo_text2.style.transform = `translateX(-${getTranslateValue(cache['play.combo.current'])}px)`;
          combo_text.style.transform = `translateX(0)`;
          combo_max.style.opacity = 0;
          combo_x.style.display = 'inline';
        };
  
        if (cache['play.combo.current'] < 10) { 
          combo_box.style.width = `${84 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
        if (cache['play.combo.current'] >= 10 && cache['play.combo.current'] < 100) { 
          combo_box.style.width = `${104 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
        if (cache['play.combo.current'] >= 100 && cache['play.combo.current'] < 1000) {
          combo_box.style.width = `${124 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
        if (cache['play.combo.current'] >= 1000 && cache['play.combo.current'] < 10000) {
          combo_box.style.width = `${154 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
        if (cache['play.combo.current'] >= 10000 && cache['play.combo.current'] < 1000) {
          combo_box.style.width = `${174 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
  
        function getMaxPxValue(x) {
          if (x < 10) return 75;
          if (x >= 10 && x < 100) return 90;
          if (x >= 100 && x < 1000) return 105;
          if (x >= 1000 && x < 10000) return 125;
        };
  
        function getTranslateValue(x) {
          if (x < 10) return 17;
          if (x >= 10 && x < 100) return 37;
          if (x >= 100 && x < 1000) return 57;
          if (x >= 1000 && x < 10000) return 87;
        };

        let pp_tx = cache['play.pp.current'] + " / " + cache['play.pp.fc'] + "pp";

        if (pp_tx.length == 7) { 
          pp_box.style.width = '150px';
        };
        if (pp_tx.length == 8) { 
          pp_box.style.width = '160px';
        };
        if (pp_tx.length == 9) {
          pp_box.style.width = '190px';
        };
        if (pp_tx.length == 10) {
          pp_box.style.width = '210px';
        };
        if (pp_tx.length == 11) {
          pp_box.style.width = '230px';
        };
        if (pp_tx.length == 12) {
          pp_box.style.width = '250px';
        };
        if (pp_tx.length == 13) {
          pp_box.style.width = '280px';
        };

        if (cache['play.pp.current'] < 10) {
            pp_txt.style.width = "22px";
        };
        if (cache['play.pp.current'] >= 10 && cache['play.pp.current'] < 100) {
            pp_txt.style.width = "40px";
        };
        if (cache['play.pp.current'] >= 100 && cache['play.pp.current'] < 1000) {
            pp_txt.style.width = "61px";
        };
        if (cache['play.pp.current'] >= 1000 && cache['play.pp.current'] < 10000) {
            pp_txt.style.width = "92px";
        };
        if (cache['play.pp.current'] >= 10000 && cache['play.pp.current'] < 1000) {
            pp_txt.style.width = "110px";
        };

        if (cache['beatmap.time.live'] > beatmap.time.live) {
          delete cache['key-k1-press'];
          delete cache['key-k1-count'];
          delete cache['key-k1-active'];
          delete cache['key-k1-r'];
          keys['k1'].bpmArray.length = 0;
      
      
          delete cache['key-k2-press'];
          delete cache['key-k2-count'];
          delete cache['key-k2-active'];
          delete cache['key-k2-r'];
          keys['k2'].bpmArray.length = 0;
      
      
          delete cache['key-m1-press'];
          delete cache['key-m1-count'];
          delete cache['key-m1-active'];
          delete cache['key-m1-r'];
          keys['m1'].bpmArray.length = 0;
      
      
          delete cache['key-m2-press'];
          delete cache['key-m2-count'];
          delete cache['key-m2-active'];
          delete cache['key-m2-r'];
          keys['m2'].bpmArray.length = 0;
        };

        if (play.healthBar.smooth > 0) {
            hp.style.clipPath = `polygon(${(1 - play.healthBar.smooth / 100) * 50}% 0%, ${(play.healthBar.smooth / 100) * 50 + 50}% 0%, ${(play.healthBar.smooth / 100) * 50 + 50}% 100%, ${(1 - play.healthBar.smooth / 100) * 50}% 100%)`;
        } else {
            hp.style.clipPath = `polygon(0 0, 93.7% 0, 93.7% 100%, 0 100%)`;
        };

        if (tempMapScores.length > 0) if (cache['play.score'] >= tempMapScores[playerPosition - 2]) playerPosition--;

        if (cache['beatmap.time.live'] >= cache['beatmap.time.lastObject'] + 1000 && cache['data.menu.state'] == 2) { rankingPanelBG.style.opacity = 1; }
    
        if (rankingPanelBG.style.opacity !== 1 && cache['data.menu.state'] == 2 && cache['beatmap.time.live'] >= cache['beatmap.time.lastObject'] + 1000 || cache['data.menu.state'] == 7) {
            if (!rankingPanelSet) setupRankingPanel();
        } else if (!(cache['beatmap.time.live'] >= cache['beatmap.time.lastObject'] - 500 && cache['data.menu.state'] == 2)) rankingPanelBG.style.opacity = 0 && deRankingPanel();

        if (cache['resultsScreen.hits[0]'] > 0 || cache['play.hits.sliderBreaks'] > 0) {
            ResultPPAndifFC.innerHTML = `FC: ${cache['play.pp.fc']} | ${cache['play.pp.current']}pp`;
        }
        else {
            ResultPPAndifFC.innerHTML = `${cache['play.pp.current']}pp`;
        };

        async function setupRankingPanel() {
            rankingPanelSet = true;
        
            rankingPanelBG.style.opacity = 1;
            RankingPanel.style.opacity = 1;
        
            arGlow.style.width = ((cache['beatmap.stats.ar.converted'].toFixed(2) * 10) - 10) + '%';
            odGlow.style.width = ((cache['beatmap.stats.od.converted'].toFixed(2) * 10) - 10) + '%';
            csGlow.style.width = ((cache['beatmap.stats.cs.converted'].toFixed(2) * 10) - 10) + '%';
            hpGlow.style.width = ((cache['beatmap.stats.hp.converted'].toFixed(2) * 10) - 10) + '%';
        
            mSR.style.transform = `scale(100%)`;
        
            mAR.style.transform = `translateY(0)`;
            mAR.style.opacity = 1
        
            mOD.style.transform = `translateY(0)`;
            mOD.style.opacity = 1
        
            mCS.style.transform = `translateY(0)`;
            mCS.style.opacity = 1
        
            mHP.style.transform = `translateY(0)`;
            mHP.style.opacity = 1
        
            rSB.style.transform = `translateY(0px)`;
            bSB.style.transform = `translateY(0px)`;
        
            r50.style.transform = `translateY(0px)`;
            b50.style.transform = `translateY(0px)`;
        
            r100.style.transform = `translateY(0px)`;
            b100.style.transform = `translateY(0px)`;
        
            r0.style.transform = `translateY(0px)`;
            b0.style.transform = `translateY(0px)`;
        
            ResultPPAndifFC.style.transform = `translateX(0)`;
            ResultScoreCombo.style.transform = `translateX(0)`;
            ResultAcc.style.transform = `translateX(0)`;
            ResultUR.style.transform = `translateX(0)`;
        
            MapDetails.style.transform = `translateY(0)`;
        
            ResultPPAndifFC.style.opacity = 1;
            ResultScoreCombo.style.opacity = 1;
            ResultAcc.style.opacity = 1;
            ResultUR.style.opacity = 1;
        
            UserAvatar.style.opacity = 1;
            PlayerStats.style.opacity = 1;
            UserAvatar.style.transform = `translateX(0)`;
            PlayerStats.style.transform = `translateX(0)`;
            PlayerData.style.transform = `translateX(0)`;
        
        
            Top1.style.transform = `translateX(0)`;
            Top2.style.transform = `translateX(0)`;
            Top3.style.transform = `translateX(0)`;
            Top4.style.transform = `translateX(0)`;
            Top5.style.transform = `translateX(0)`;
        
            Top1.style.opacity = 1;
            Top2.style.opacity = 1;
            Top3.style.opacity = 1;
            Top4.style.opacity = 1;
            Top5.style.opacity = 1;
        
            qcsContainer.style.transform = `translateY(0)`;
            qcsContainer.style.opacity = 1;
        
            rBPM.style.transform = `translateY(0)`;
        
            resultRecorder.style.transform = 'none';
        };
        async function deRankingPanel() {
            rankingPanelSet = false;
        
            RankingPanel.style.opacity = 0;
        
            mCS.style.opacity = 0;
            mAR.style.opacity = 0;
            mOD.style.opacity = 0;
            mHP.style.opacity = 0;
        
            ResultPPAndifFC.style.opacity = 0;
            ResultScoreCombo.style.opacity = 0;
            ResultAcc.style.opacity = 0;
            ResultUR.style.opacity = 0;
        
            UserAvatar.style.opacity = 0;
            PlayerStats.style.opacity = 0;
        
            Top1.style.opacity = 0;
            Top2.style.opacity = 0;
            Top3.style.opacity = 0;
            Top4.style.opacity = 0;
            Top5.style.opacity = 0;
        
            qcsContainer.style.opacity = 0;
        
            mSR.style.transform = `scale(50%)`
        
            arGlow.style.width = '0%';
            csGlow.style.width = '0%';
            odGlow.style.width = '0%';
            hpGlow.style.width = '0%';
        
            mCS.style.transform = `translateY(-150px)`;
            mAR.style.transform = `translateY(-150px)`;
            mOD.style.transform = `translateY(-150px)`;
            mHP.style.transform = `translateY(-150px)`;
        
            rSB.style.transform = `translateY(120px)`;
            bSB.style.transform = `translateY(120px)`;
        
            r50.style.transform = `translateY(120px)`;
            b50.style.transform = `translateY(120px)`;
        
            r100.style.transform = `translateY(120px)`;
            b100.style.transform = `translateY(120px)`;
        
            r0.style.transform = `translateY(120px)`;
            b0.style.transform = `translateY(120px)`;
        
            MapDetails.style.transform = `translateY(240px)`;
            ResultPPAndifFC.style.transform = `translateX(440px)`;
            ResultScoreCombo.style.transform = `translateX(-440px)`;
            ResultAcc.style.transform = `translateX(-220px)`;
            ResultUR.style.transform = `translateX(220px)`;
        
            UserAvatar.style.transform = `translateX(50px)`;
            PlayerStats.style.transform = `translateX(50px)`;
            PlayerData.style.transform = `translateX(600px)`;
        
            Top1.style.transform = `translateX(600px)`;
            Top2.style.transform = `translateX(600px)`;
            Top3.style.transform = `translateX(600px)`;
            Top4.style.transform = `translateX(600px)`;
            Top5.style.transform = `translateX(600px)`;
        
            qcsContainer.style.transform = `translateY(150px)`;
        
            rBPM.style.transform = `translateY(220px)`;
        };
        
    } catch (error) {
        console.log(error);
    };
  });

  socket.api_v2_precise((data) => {
    try {
      if (cache['data.menu.state'] != 2) return;
  
      const keysArray = Object.keys(data.keys);
      for (let i = 0; i < keysArray.length; i++) {
        const key = keysArray[i];
        const value = data.keys[key];
  
        if (cache[`key-${key}-press`] != value.isPressed) {
          cache[`key-${key}-press`] = value.isPressed;
          keys[key].blockStatus(value.isPressed);
  
          const status = value.isPressed ? 'add' : 'remove';
          document.getElementById(`${key}Press`).classList[status]('active');
        };
  
  
        if (cache[`key-${key}-count`] != value.count) {
          document.getElementById(`${key}Count`).innerHTML = value.count;
          keys[key].registerKeypress();
  
          if (value.count >= 20) cache[`key-${key}-r`] = true;
          cache[`key-${key}-count`] = value.count;
        };
  
  
        if (value.count > 0) {
          document.querySelector(`.keys.${key}`).classList.remove('hidden');
        }
        else {
          document.querySelector(`.keys.${key}`).classList.add('hidden');
        };
      };

      if (data.hitErrors !== null) {
        tempSmooth = smooth(data.hitErrors, 4);
        if (tempHitErrorArrayLength !== tempSmooth.length) {
            tempHitErrorArrayLength = tempSmooth.length;
            for (var a = 0; a < tempHitErrorArrayLength; a++) {
                tempAvg = tempAvg * 0.9 + tempSmooth[a] * 0.1;
            };
            tickPos = data.hitErrors[tempHitErrorArrayLength - 1] / 2 * 3;
            currentErrorValue = data.hitErrors[tempHitErrorArrayLength - 1];
            avgHitError.style.transform = `translateX(${(tempAvg / 2) * 3}px)`;

            for (var c = 0; c < 200; c++) {
                if ((tempHitErrorArrayLength % 200) == ((c + 1) % 200)) {
                    tick[c].style.transform = `translateX(${tickPos}px)`;
                    tick[c].style.transition = `opacity ease 300ms`;

                    if (currentErrorValue >= -(error_h300) && currentErrorValue <= error_h300) {
                        tick[c].style.backgroundColor = 'rgba(134, 211, 255, 1)';
                    }
                    else if (currentErrorValue >= -(error_h100) && currentErrorValue <= error_h100) {
                        tick[c].style.backgroundColor = 'rgba(136, 255, 134, 1)';
                    }
                    else {
                        tick[c].style.backgroundColor = 'rgba(255, 213, 134, 1)';
                    };

                    var s = document.querySelectorAll("[id^=tick]")[c].style;
                    s.opacity = 1;
                    setTimeout(fade, 1500);
                    function fade() {
                        s.opacity = 0;
                        s.transition = `opacity ease 4s`;
                    };
                };
            };
        };
    };

    } catch (err) {
      console.log(err);
    };
  });
let config = {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                borderColor: "rgba(255, 255, 255, 0)",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                data: [],
                fill: true,
            },
        ],
    },
    options: {
        tooltips: { enabled: false },
        legend: {
            display: false,
        },
        elements: {
            line: {
                tension: 0.4,
                cubicInterpolationMode: "monotone",
            },
            point: {
                radius: 0,
            },
        },
        responsive: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    },
};

let configSecond = {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                borderColor: "rgba(0, 0, 0, 0)",
                borderWidth: "2",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                data: [],
                fill: true,
            },
        ],
    },
    options: {
        tooltips: { enabled: false },
        legend: {
            display: false,
        },
        elements: {
            line: {
                tension: 0.4,
                cubicInterpolationMode: "monotone",
            },
            point: {
                radius: 0,
            },
        },
        responsive: false,
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
    },
};
async function setupUser(name) {
    let userData = await getUserDataSet(name);
    let playerBest;

    if (userData.error === null) {
        userData = {
            "id": "HosizoraN",
            "username": `${name}`,
            "statistics": {
                "global_rank": "0",
                "pp": "0",
                "country_rank": "0",
            },
            "country_code": "__",
        }
        playerBest = {
            "0": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "1": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "2": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "3": {
                "beatmap_id": "-1",
                "pp": "-"
            },
            "4": {
                "beatmap_id": "-1",
                "pp": "-"
            }
        };
        for (var i = 0; i < 5; i++) {
            document.getElementById(`bg${i + 1}`).style.backgroundImage = ``;
            document.getElementById(`TopDate${i + 1}`).innerHTML = ``;
            document.getElementById(`TopRanking${i + 1}`).innerHTML = ``;
            document.getElementById(`topPP${i + 1}`).innerHTML = ``;
            document.getElementById(`TopMods${i + 1}`).innerHTML = ``;
        };
    }
    else {
        playerBest = await getUserTop(userData.id);
        for (var i = 0; i < 5; i++) {
            let mapData = await getMapDataSet(playerBest[i]["beatmap_id"]);
            document.getElementById(`bg${i + 1}`).style.backgroundImage = `url('https://assets.ppy.sh/beatmaps/${mapData.beatmapset_id}/covers/cover.jpg')`;
            document.getElementById(`TopDate${i + 1}`).innerHTML = playerBest[i]["ended_at"].replace("T", " ").replace("Z", " ");
            document.getElementById(`TopRanking${i + 1}`).innerHTML = playerBest[i]["rank"].replace("H", "");
            document.getElementById(`TopRanking${i + 1}`).setAttribute("class", `topRanking ${playerBest[i]["rank"]}`);
            document.getElementById(`topPP${i + 1}`).innerHTML = `${Math.round(playerBest[i]["pp"])}pp`;

            let ModsResult = (parseInt(playerBest[i]['mods_id']) >>> 0).toString(2).padStart(15, "0");
            let tempModsLiteral = "";
        
            if (ModsResult !== "000000000000000")
                for (var j = 14; j >= 0; j--) {
                    if (ModsResult[j] === "1") {
                        switch (j) {
                            case 0:
                                tempModsLiteral += "PF";
                                break;
                            case 1:
                                tempModsLiteral += "AP";
                                break;
                            case 2:
                                tempModsLiteral += "SO";
                                break;
                            case 3:
                                tempModsLiteral += "AT";
                                break;
                            case 4:
                                tempModsLiteral += "FL";
                                break;
                            case 5:
                                tempModsLiteral += "NC";
                                break;
                            case 6:
                                tempModsLiteral += "HT";
                                break;
                            case 7:
                                tempModsLiteral += "RX";
                                break;
                            case 8:
                                tempModsLiteral += "DT";
                                break;
                            case 9:
                                tempModsLiteral += "SD";
                                break;
                            case 10:
                                tempModsLiteral += "HR";
                                break;
                            case 11:
                                tempModsLiteral += "HD";
                                break;
                            case 12:
                                tempModsLiteral += "TD";
                                break;
                            case 13:
                                tempModsLiteral += "EZ";
                                break;
                            case 14:
                                tempModsLiteral += "NF";
                                break;
                        }
                    }
                }
            else tempModsLiteral = "NM";

            document.getElementById(`TopMods${i + 1}`).innerHTML = " ";
        
            let ModsRCount = tempModsLiteral.length;
        
            for (var k = 0; k < ModsRCount; k++) {
                let modsR = document.createElement("div");
                modsR.id = tempModsLiteral.substr(k, 2) + i;
                modsR.setAttribute("class", `modslb ${tempModsLiteral.substr(k, 2)}`);
                modsR.style.backgroundImage = `url('./static/mods/${tempModsLiteral.substr(k, 2)}.png')`;
                document.getElementById(`TopMods${i + 1}`).appendChild(modsR);
                k++;
            };
        };
    };

    if (userData.id !== "HosizoraN") {
        ava.style.backgroundImage = `url('https://a.ppy.sh/${userData.id}')`;
        UserAvatar.style.backgroundImage = `url('https://a.ppy.sh/${userData.id}')`;
        lbcpAvatar.style.backgroundImage = `url('https://a.ppy.sh/${userData.id}')`;
    } else {
        ava.style.backgroundImage = "url('./static/gamer.png')";
        UserAvatar.style.backgroundImage = "url('./static/gamer.png')";
        lbcpAvatar.style.backgroundImage = "url('./static/gamer.png')";
    };

    const tempCountry = `${userData.country_code
        .split("")
        .map((char) => 127397 + char.charCodeAt())[0]
        .toString(16)}-${userData.country_code
        .split("")
        .map((char) => 127397 + char.charCodeAt())[1]
        .toString(16)}`;

    country.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;
    rFlag.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;

    ranks.innerHTML = "#" + userData.statistics.global_rank;
    GlobalRank.innerHTML = `#` + userData.statistics.global_rank;

    countryRank.innerHTML = "#" + userData.statistics.country_rank;
    CountryRank.innerHTML = `#${userData.statistics.country_rank} ${userData.country_code}`;

    playerPP.innerHTML = Math.round(userData.statistics.pp) + "pp";

    if (cache['ColorSet'] == `API`) {
    const avatarColor = await postUserID(userData.id);

    if (avatarColor) {
        const ColorData1 = `${avatarColor.hsl1[0] * 360}, ${avatarColor.hsl1[1] * 100}%, 50%`;
        const ColorData2 = `${avatarColor.hsl2[0] * 360}, ${avatarColor.hsl2[1] * 100}%, 70%`;

        document.getElementById("lefthp1").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp2").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp3").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp4").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp5").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp6").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp7").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp8").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp9").style.fill = `hsl(${ColorData1})`;
        document.getElementById("lefthp10").style.fill = `hsl(${ColorData1})`;

        document.getElementById("righthp1").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp2").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp3").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp4").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp5").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp6").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp7").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp8").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp9").style.fill = `hsl(${ColorData2})`;
        document.getElementById("righthp10").style.fill = `hsl(${ColorData2})`;

        smallStats.style.backgroundColor = `hsl(${ColorData1})`;

        combo_box.style.backgroundColor = `hsl(${ColorData1})`;
        combo_box.style.filter = `drop-shadow(0 0 10px hsla(${ColorData1}))`;

        pp_box.style.backgroundColor = `hsl(${ColorData2})`;
        pp_box.style.filter = `drop-shadow(0 0 10px hsla(${ColorData2}))`;

        document.querySelector('.keys.k1').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.k2').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.m1').style.setProperty('--press', `hsl(${ColorData2})`);
        document.querySelector('.keys.m2').style.setProperty('--press', `hsl(${ColorData2})`);

        keys.k1.color = `hsla(${ColorData1}, 0.8)`;
        keys.k2.color = `hsla(${ColorData1}, 0.8)`;
        keys.m1.color = `hsla(${ColorData2}, 0.8)`;
        keys.m2.color = `hsla(${ColorData2}, 0.8)`;

        config.data.datasets[0].backgroundColor = `hsla(${ColorData1}, 0.2)`;
        configSecond.data.datasets[0].backgroundColor = `hsl(${ColorData1})`;

        rBPM.style.backgroundColor = `hsl(${ColorData1})`;
        rBPM.style.boxShadow = `0 0 5px 2px hsl(${ColorData1})`;

        lbcpLine.style.backgroundColor = `hsl(${ColorData1})`;
        lbcpLine.style.boxShadow = `0 0 10px 2px hsla(${ColorData1}, 0.5)`;
        };
    };
};

async function setupMapScores(beatmapID) {
    if (leaderboardFetch == false) {
        leaderboardFetch = true;

        let data = await getMapScores(beatmapID);

        if (data) {
            tempSlotLength = data.length;
            playerPosition = data.length + 1;
        } else {
            tempSlotLength = 0;
            playerPosition = 51;
        };

        for (var i = tempSlotLength; i > 0; i--) {
            tempMapScores[i - 1] = data[i - 1].score;

            let playerContainer = document.createElement("div");
            playerContainer.id = `playerslot${i}`;
            playerContainer.setAttribute("class", "lbBox");
            playerContainer.style.top = `${(i - 1) * 60}px`;

            let playerNumber = `
                        <div id="lb_Number_slot${i}" class="lb_Number">
                            <div id="lb_Ranking_slot${i}" class="${data[i - 1].rank}">${data[i - 1].rank.replace("H", "")}</div>
                            <div id="lb_Positions_slot${i}" class="N${i}">${i}</div>
                        </div>
            `;

            let playerAvatar = `
                        <div id="lb_Avatar_slot${i}" class="lb_Avatar" style="background-image: url('https://a.ppy.sh/${data[i - 1].id}')"></div> 
            `;

            let playerStats = `
                        <div id="lb_Stats_slot${i}" class="lb_Stats">
                            <div id="lb_StatsLeft_slot${i}" class="lb_StatsLeft">
                                <div id="lb_Name_slot${i}" class="lb_Name">${data[i - 1].name}</div>
                                <div id="lb_Score_slot${i}">${numberWithCommas(data[i - 1].score)}</div>
                            </div>
                            <div id="lb_Combo_slot${i}" class="lb_Combo">${data[i - 1].combo}x</div>
                            <div id="lb_StatsRight_slot${i}" class="lb_StatsRight">
                                <div id="lb_PP_slot${i}" class="lb_PP">${Math.round(data[i - 1].pp)}pp</div>
                                <div id="lb_Acc_slot${i}">${data[i - 1].acc}%</div>
                            </div>
                        </div>
            `;

            let playerMods = `
                        <div id="lb_Mods_slot${i}" class="lb_Mods"></div>
            `;

            playerContainer.innerHTML = `
                ${playerNumber}
                ${playerAvatar}
                ${playerStats}
                ${playerMods}
            `;

            document.getElementById("lbopCont").appendChild(playerContainer);

            let minimodsCount = data[i - 1].mods.length;

            for (var k = 0; k < minimodsCount; k++) {
                let mods = document.createElement("div");
                mods.id = data[i - 1].mods.substr(k, 2) + i;
                mods.setAttribute("class", `modslb ${data[i - 1].mods.substr(k, 2)}`);
                mods.style.backgroundImage = `url('./static/mods/${data[i - 1].mods.substr(k, 2)}.png')`;
                document.getElementById(`lb_Mods_slot${i}`).appendChild(mods);
                k++;
            };
        };
    };
};

async function getUserDataSet(id) {
    try {
        const data = (await axios.get(`https://phubahosi.vercel.app/api/user/${id}`)).data;
        return data;
    } catch (error) {
        console.error(error);
    }
}
async function postUserID(id) {
    try {
        let ColorData = null;
        const data = await axios.get(`https://phubahosi.vercel.app/api/color/${id}`).then((response) => {
            ColorData = response.data
        });
        return ColorData;
    } catch (error) {
        console.error(error);
    }
}

async function getUserTop(bestid) {
    try {
        const data = (
            await axios.get(`/user/${bestid}/best`, {
                baseURL: "https://phubahosi.vercel.app/api",
            })
        )["data"];
        return data;
    } catch (error) {
        console.error(error);
    };
};

async function getMapDataSet(beatmapID) {
    try {
        const data = (
            await axios.get(`/beatmap/${beatmapID}`, {
                baseURL: "https://phubahosi.vercel.app/api",
            })
        )["data"];
        return data;
    } catch (error) {
        console.error(error);
    };
};

async function getMapScores(beatmapID) {
    try {
        const data = (
            await axios.get(`/${beatmapID}/global`, {
                baseURL: "https://phubahosi.vercel.app/api/beatmap",
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    };
};