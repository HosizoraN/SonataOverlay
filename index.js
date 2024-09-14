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

const graph_options = {
  colors: ["#d3d3d3", "#d3d3d3"],
  chart: {
    type: "area",

    width: 380,
    height: 160,

    animations: {
      enabled: true
    },

    toolbar: {
      show: false,
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  stroke: {
    curve: "straight",
    width: 1,
  },
  fill: {
    opacity: [0.5,0.8]
  },

  yaxis: {
    min: 0,
    show: false,

    labels: {
      show: false,
      position: 'left'
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false
    }
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0
    },
  },
  series: [],
  xaxis: {
    type: "numeric",
    categories: [],
    labels: {
      show: false,
      position: 'left'
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false
    }
  },

  tooltip: {
    enabled: false
  }
};

var chart = '';
var chart2 = '';

const score = new CountUp('score', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: "." })
const acc = new CountUp('acc', 0, 0, 2, 1, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "%" })
const h100 = new CountUp('h100', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })
const h50 = new CountUp('h50', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })
const h0 = new CountUp('h0', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })
const hSB = new CountUp('hSB', 0, 0, 0, .5, { useEasing: true, useGrouping: true, separator: " ", decimal: ".", suffix: "x" })

let progressbar;
let rankingPanelSet;
let fullTime;
let seek;
let smoothOffset = 2;
let smoothed;
let onepart;
let tickPos;
let tempAvg;
let tempSmooth;
let currentErrorValue;
let tempHitErrorArrayLength;
let error_h300;
let error_h100;

let leaderboardFetch;
let tempSlotLength;
let tempMapScores = [];
let playerPosition;
let LocalNameData;
let LocalResultNameData;
let LBUpTimer;
let previousUpTimer;

let tick = [];
for (var t = 0; t < 200; t++) {
    tick[t] = document.querySelectorAll("[id^=tick]")[t];
}

function calculate_od(temp) {
    error_h300 = 83 - (6 * temp);
    error_h100 = 145 - (8 * temp);
    l100.style.width = `${error_h100 * 3}px`
    l300.style.width = `${error_h300 * 3}px`
};

const spaceit = (text) => text.toLocaleString().replace(/,/g, ' ');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

window.onload = () => {
    chart = new ApexCharts(document.querySelector("#graph"), { ...graph_options });
    chart.render();
    chart2 = new ApexCharts(document.querySelector("#graph2"), { ...graph_options });
    chart2.render();

    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config);

    var ctxSecond = document.getElementById("canvasSecond").getContext("2d");
    window.myLineSecond = new Chart(ctxSecond, configSecond);
  }
  

socket.sendCommand('getSettings', encodeURI(window.COUNTER_PATH));
socket.commands((data) => {
    try {
      const { command, message } = data;
      // get updates for "getSettings" command
      if (command == 'getSettings') {
        console.log(command, message); // print out settings for debug
      };

      if (cache['LocalNameData'] != message['LocalNameData']) {
        cache['LocalNameData'] = message['LocalNameData'];
      };

      if (cache['DebugMode'] != message['DebugMode']) {
        cache['DebugMode'] = message['DebugMode'];
      };

      if (cache['GBrank'] != message['GBrank']) {
        cache['GBrank'] = message['GBrank'];
      };

      if (cache['ppGB'] != message['ppGB']) {
        cache['ppGB'] = message['ppGB'];
      };

      if (cache['CTrank'] != message['CTrank']) {
        cache['CTrank'] != message['CTrank'];
      };

      if (cache['CTcode'] != message['CTcode']) {
        cache['CTcode'] = message['CTcode']
      };

      if (cache['mapid0'] != message['mapid0']) {
        cache['mapid0'] = message['mapid0'];
      };
      if (cache['mapid_1'] != message['mapid1']) {
        cache['mapid1'] = message['mapid1'];
      };
      if (cache['mapid2'] != message['mapid2']) {
        cache['mapid2'] = message['mapid2'];
      };
      if (cache['mapid3'] != message['mapid3']) {
        cache['mapid3'] = message['mapid3'];
      };
      if (cache['mapid4'] != message['mapid4']) {
        cache['mapid4'] = message['mapid4'];
      };
      if (cache['mapid5'] != message['mapid5']) {
        cache['mapid5'] = message['mapid5'];
      };

      if (cache['ppResult0'] != message['ppResult0']) {
        cache['ppResult0'] = message['ppResult0'];
      };
      if (cache['ppResult1'] != message['ppResult1']) {
        cache['ppResult1'] = message['ppResult1'];
      };
      if (cache['ppResult2'] != message['ppResult2']) {
        cache['ppResult2'] = message['ppResult2'];
      };
      if (cache['ppResult3'] != message['ppResult3']) {
        cache['ppResult3'] = message['ppResult3'];
      };
      if (cache['ppResult4'] != message['ppResult4']) {
        cache['ppResult4'] = message['ppResult4'];
      };
      if (cache['ppResult5'] != message['ppResult5']) {
        cache['ppResult5'] = message['ppResult5'];
      };

      if (cache['modsid0'] != message['modsid0']) {
        cache['modsid0'] = message['modsid0'];
      };
      if (cache['modsid1'] != message['modsid1']) {
        cache['modsid1'] = message['modsid1'];
      };
      if (cache['modsid2'] != message['mods_id2']) {
        cache['modsid2'] = message['mods_id2'];
      };
      if (cache['modsid3'] != message['modsid3']) {
        cache['modsid3'] = message['modsid3'];
      };
      if (cache['modsid4'] != message['modsid4']) {
        cache['modsid4'] = message['modsid4'];
      };
      if (cache['modsid5'] != message['modsid5']) {
        cache['modsid5'] = message['modsid5'];
      };

      if (cache['rankResult0'] != message['rankResult0']) {
        cache['rankResult0'] = message['rankResult0'];
      };
      if (cache['rankResult1'] != message['rankResult1']) {
        cache['rankResult1'] = message['rankResult1'];
      };
      if (cache['rankResult2'] != message['rankResult2']) {
        cache['rankResult2'] = message['rankResult2'];
      };
      if (cache['rankResult3'] != message['rankResult3']) {
        cache['rankResult3'] = message['rankResult3'];
      };
      if (cache['rankResult4'] != message['rankResult4']) {
        cache['rankResult4'] = message['rankResult4'];
      };
      if (cache['rankResult5'] != message['rankResult5']) {
        cache['rankResult5'] = message['rankResult5'];
      };

      if (cache['date0'] != message['date0']) {
        cache['date0'] = message['date0'];
      };
      if (cache['date_'] != message['date1']) {
        cache['date1'] = message['date1'];
      };
      if (cache['date2'] != message['date2']) {
        cache['date2'] = message['date2'];
      };
      if (cache['date3'] != message['date3']) {
        cache['date3'] = message['date3'];
      };
      if (cache['date4'] != message['date4']) {
        cache['date4'] = message['date4'];
      };
      if (cache['date5'] != message['date5']) {
        cache['date5'] = message['date5'];
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

      if (cache['DebugMode'] == true) {
        DevDebugContainer.style.display = 'block';
        main.style.display = 'none';
      }
      else {
        DevDebugContainer.style.display = 'none';
        main.style.display = 'block';
      }

      if (cache['ColorSet'] != message['ColorSet']) {
        cache['ColorSet'] = message['ColorSet'];
      };

      if (cache['ColorSet'] == `Manual`) {
        const ColorData1 = `${message['HueID']}, ${message['SaturationID']}%, 50%`;
        const ColorData2 = `${message['HueID2']}, ${message['SaturationID2']}%, 50%`;
        const ColorResultLight = `${message['HueID']}, ${message['SaturationID']}%, 82%`;
        const ColorResultDark = `${message['HueID']}, ${message['SaturationID']}%, 6%`;

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

        config.data.datasets[0].backgroundColor = `hsla(${ColorData1}, 0.2)`;
        configSecond.data.datasets[0].backgroundColor = `hsl(${ColorData1})`;

        document.querySelector('.keys.k1').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.k2').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.m1').style.setProperty('--press', `hsl(${ColorData2})`);
        document.querySelector('.keys.m2').style.setProperty('--press', `hsl(${ColorData2})`);

        keys.k1.color = `hsla(${ColorData1}, 0.8)`;
        keys.k2.color = `hsla(${ColorData1}, 0.8)`;
        keys.m1.color = `hsla(${ColorData2}, 0.8)`;
        keys.m2.color = `hsla(${ColorData2}, 0.8)`;

        lbcpLine.style.backgroundColor = `hsl(${ColorData1})`;
        lbcpLine.style.boxShadow = `0 0 10px 2px hsla(${ColorData1}, 0.5)`;

        RankingPanel.style.backgroundColor = `hsla(${ColorResultDark}, 0.9)`;

        SonataTextResult.style.color = `hsl(${ColorResultLight})`;
        bgborder.style.border = `3px solid hsl(${ColorResultLight})`;
        StatsBPM.style.border = `3px solid hsl(${ColorResultLight})`;

        CSLine.style.border = `3px solid hsl(${ColorResultLight})`;
        ARLine.style.border = `3px solid hsl(${ColorResultLight})`;
        ODLine.style.border = `3px solid hsl(${ColorResultLight})`;
        HPLine.style.border = `3px solid hsl(${ColorResultLight})`;

        PHCS.style.color = `hsl(${ColorResultLight})`;
        PHAR.style.color = `hsl(${ColorResultLight})`;
        PHOD.style.color = `hsl(${ColorResultLight})`;
        PHHP.style.color = `hsl(${ColorResultLight})`;

        CSGlow.style.backgroundColor = `hsl(${ColorResultLight})`;
        ARGlow.style.backgroundColor = `hsl(${ColorResultLight})`;
        ODGlow.style.backgroundColor = `hsl(${ColorResultLight})`;
        HPGlow.style.backgroundColor = `hsl(${ColorResultLight})`;

        MiddleBar.style.backgroundColor = `hsl(${ColorResultLight})`;
      };

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
  
  socket.api_v2(({ state, settings, session, performance, resultsScreen, play, beatmap, folders, files, profile}) => {
    try {

        if (cache['showInterface'] != settings.interfaceVisible) {
            cache['showInterface'] = settings.interfaceVisible;
        };
        if (cache['data.menu.state'] != state.number || cache['data.menu.state.name'] != state.name) {
            cache['data.menu.state'] = state.number;
            cache['data.menu.state.name'] = state.name;
            if (cache['data.menu.state'] == 3) {
                CrashReason.innerHTML = 
                `The osu! client has been down (or the client has been crashed)
                please relaunch the client owo!`;
                CrashReportDebug.classList.remove('crashpop');
            }
            else {
                CrashReportDebug.classList.add('crashpop');
            };

            State.innerHTML = cache['data.menu.state'] + ` (${cache['data.menu.state.name']})`;

            if (cache['data.menu.state'] == 0) {
                MainMenuDebug.style.opacity = 1;
            }
            else {
                MainMenuDebug.style.opacity = 0;
            };
            if (cache['data.menu.state'] == 5) {
                GameState5Debug.style.opacity = 1;
            }
            else {
                GameState5Debug.style.opacity = 0;
            };
            if (cache['data.menu.state'] == 7) {
                GameState7Debug.style.opacity = 1;
            }
            else {
                GameState7Debug.style.opacity = 0;
            };
            if (cache['data.menu.state'] == 2) {
                GameState2Debug.style.opacity = 1;
            }
            else {
                GameState2Debug.style.opacity = 0;
            };
        };
        if (cache['playtime'] != session.playTime) {
            cache['playtime'] = session.playTime;
            Session.innerHTML = `
            <div>Play Time: ${secondsToHumanReadable(session.playTime)} (${spaceit(session.playTime)})</div>
            <div>Play Count: ${session.playCount}
            `
        };

        if (cache['settings.leaderboard'] != settings.leaderboard) {
            cache['settings.leaderboard'] = settings.leaderboard;
            LocalLB.innerHTML = 
            `
            <div>Visible: ${settings.leaderboard.visible}</div>
            <div>${settings.leaderboard.type.name} (${settings.leaderboard.type.number})</div>
            `
        } 

        if (cache['settings'] != settings) {
            cache['settings'] = settings;
            ClientData.innerHTML = 
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Client Version: ${settings.client.version} (Update: ${settings.client.updateAvailable})</div>
            <div>Branch: ${settings.client.branch}</div>
            <div>Sonata Debug Version: 1.0</div>
            `
            SettingsData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Meter</div>
            <div>Type: ${settings.scoreMeter.type.name} (${settings.scoreMeter.type.number})</div>
            <div>Size: ${settings.scoreMeter.size}</div>
            <div>Progress Bar Type: ${settings.progressBar.name} (${settings.progressBar.number})</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Background</div>
            <div>Dim: ${settings.background.dim}</div>
            <div>Video: ${settings.background.video}</div>
            <div>Storyboard: ${settings.background.storyboard}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Cursor</div>
            <div>Use Beatmaps Skin Cursor: ${settings.cursor.useSkinCursor}</div>
            <div>Size: ${settings.cursor.size} (Auto Size: ${settings.cursor.autoSize})
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Mania</div>
            <div>Speed Scale by BPM: ${settings.mania.speedBPMScale}</div>
            <div>Use Per Beatmaps Speed Scale: ${settings.mania.usePerBeatmapSpeedScale}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Skin</div>
            <div>Use Peppy Skin in Editor: ${settings.skin.useDefaultSkinInEditor}</div>
            <div>Ignore Beatmap Skins: ${settings.skin.ignoreBeatmapSkins}</div>
            <div>Tint Slider Ball: ${settings.skin.tintSliderBall}</div>
            <div>Use Taiko Skin: ${settings.skin.useTaikoSkin}</div>
            `
            AudioNumber.innerHTML = 
            `
            <div style="width: 60px;">${settings.audio.volume.master}</div>
            <div style="width: 60px;">${settings.audio.volume.music}</div>
            <div style="width: 60px;">${settings.audio.volume.effect}</div>
            `
            Offset.innerHTML = `Current Offset: ${settings.audio.offset.universal}ms`
            MasterFill.style.height = settings.audio.volume.master + '%'
            MusicFill.style.height = settings.audio.volume.music + '%'
            EffectFill.style.height = settings.audio.volume.effect + '%'
            Mode.innerHTML = settings.mode.name + ` (${settings.mode.number})`
            Bass.innerHTML = `Bass Density: ` + settings.bassDensity.toFixed(4)
            ReplaysSettingsData.innerHTML = 
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Interface: ${settings.interfaceVisible}</div>
            <div>ReplaysUI: ${settings.replayUIVisible}</div>
            `
            SortGroupData.innerHTML = 
            `
            <div class="DebugText">Sort</div>
            <div>${settings.sort.name} (${settings.sort.number})</div>
            <div class="DebugText">Group</div>
            <div>${settings.group.name} (${settings.group.number})</div>
            `
            InputData.innerHTML = 
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Mouse</div>
            <div>Raw Input: ${settings.mouse.rawInput}</div>
            <div>Disable Mouse Click Buttons: ${settings.mouse.disableButtons}</div>
            <div>Disable Mouse Wheel: ${settings.mouse.disableWheel}</div>
            <div>Sensitivity: ${settings.mouse.sensitivity}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Key Binds</div>
            <div>K1: ${settings.keybinds.osu.k1} (Fruits: ${settings.keybinds.fruits.k1})</div>
            <div>K2: ${settings.keybinds.osu.k2} (Fruits: ${settings.keybinds.fruits.k2})</div>
            <div>Smoke Key: ${settings.keybinds.osu.smokeKey}</div>
            <div>Dash Key: ${settings.keybinds.fruits.Dash}</div>
            <div>Taiko Inner Left: ${settings.keybinds.taiko.innerLeft}</div>
            <div>Taiko Inner Right: ${settings.keybinds.taiko.innerRight}</div>
            <div>Taiko Outer Left: ${settings.keybinds.taiko.outerLeft}</div>
            <div>Taiko Outer Right: ${settings.keybinds.taiko.outerRight}</div>
            <div>Spam Retry Button: ${settings.keybinds.quickRetry}</div>
            `
        };
        if (cache['profile'] != profile) {
            cache['profile'] = profile;
            ProfileData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Online Status: ${profile.userStatus.name} (${profile.userStatus.number})</div>
            <div>Bancho Status: ${profile.banchoStatus.name} (${profile.banchoStatus.number})</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Username: ${profile.name} (ID: ${profile.id})</div>
            <div>Mode: ${profile.mode.name} (${profile.mode.number})</div>
            <div>Ranked Score: ${profile.rankedScore}</div>
            <div>PP: ${profile.pp}</div>
            <div>Accuracy: ${profile.accuracy}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Total Play Count: ${profile.playCount}</div>
            <div>Level: ${profile.level}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Global Rank: ${profile.globalRank}</div>
            <div>Country: ${profile.countryCode.name} (${profile.countryCode.number})</div>
            `
        }
        if (cache['mode'] != play.mode.name) {
            cache['mode'] = play.mode.name;
            global.style.backgroundImage = `url(./static/mode/${cache['mode']}.png)`;
        };
        if (cache['play'] != play) {
            cache['play'] = play;
            GameplayData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Player: ${play.playerName}
            <div>Health Percent: ${play.healthBar.normal.toFixed(0)} (Smooth: ${play.healthBar.smooth.toFixed(0)})</div>
            <div>Current Grade: ${play.rank.current}</div>
            <div>Highest Grade Can Archive: ${play.rank.maxThisPlay}</div>
            <div>Maximum PP Can Archive: ${play.pp.maxAchievedThisPlay}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Score: ${play.score}</div>
            <div>Accuracy: ${play.accuracy.toFixed(2)}%</div>
            <div>Combo: ${play.combo.current} (Max: ${play.combo.max})
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Geki: ${play.hits.geki}</div>
            <div>300: ${play.hits[300]}</div>
            <div>Katu: ${play.hits.katu}</div>
            <div>100: ${play.hits[100]}</div>
            <div>50: ${play.hits[50]}</div>
            <div>0: ${play.hits[0]}</div>
            <div>Sliderbreaks: ${play.hits.sliderBreaks}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Unstable Rate: ${play.unstableRate.toFixed(2)}
            <div>Mods: ${play.mods.name} (${play.mods.number})</div>
            `
        };
        if (cache['hp.normal'] != play.healthBar.normal.toFixed(2)) {
            cache['hp.normal'] = play.healthBar.normal.toFixed(2);
        };
        if (cache['play.name'] != play.playerName) {
            cache['play.name'] = play.playerName;
            if (cache['play.name'] == "") {
                LocalNameData = cache['LocalNameData'] || 'Kiana';
            }
            else {
                LocalNameData = cache['play.name'];
            }
            username.innerHTML = LocalNameData;
            lbcpName.innerHTML = LocalNameData;
            setupUser(LocalNameData);
        };
        if (cache['play.rank.current'] != play.rank.current) {
            cache['play.rank.current'] = play.rank.current;
            lbcpRanking.innerHTML = cache['play.rank.current'].replace("H", "");
            lbcpRanking.setAttribute('class', `${play.rank.current}`);
        };
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
        if (cache['pp.detailed'] != play.pp.detailed) {
            cache['pp.detailed'] = play.pp.detailed;
            PPDetailedData.innerHTML = 
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Current</div>
            <div>Aim: ${play.pp.detailed.current.aim}</div>
            <div>Speed: ${play.pp.detailed.current.speed}</div>
            <div>Accuracy: ${play.pp.detailed.current.accuracy}</div>
            <div>Difficulty: ${play.pp.detailed.current.difficulty}</div>
            <div>Flashlight: ${play.pp.detailed.current.flashlight}</div>
            <div>Total: ${play.pp.detailed.current.total}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">If FC</div>
            <div>Aim: ${play.pp.detailed.fc.aim}</div>
            <div>Speed: ${play.pp.detailed.fc.speed}</div>
            <div>Accuracy: ${play.pp.detailed.fc.accuracy}</div>
            <div>Difficulty: ${play.pp.detailed.fc.difficulty}</div>
            <div>Flashlight: ${play.pp.detailed.fc.flashlight}</div>
            <div>Total: ${play.pp.detailed.fc.total}</div>
            `
        };
        if (cache['unstableRate'] != play.unstableRate) {
            cache['unstableRate'] = play.unstableRate;
            URIndex.innerHTML = cache['unstableRate'].toFixed(0);
        };
        if (cache['beatmap_rankedStatus'] != beatmap.status.number) {
            cache['beatmap_rankedStatus'] = beatmap.status.number;

            switch (cache['beatmap_rankedStatus']) {
                case 4:
                    rankStatus.style.backgroundImage = `url('./static/state/ranked.png')`;
                    break;
                case 7:
                    rankStatus.style.backgroundImage = `url('./static/state/loved.png')`;
                    break;
                case 5:
                case 6:
                    rankStatus.style.backgroundImage = `url('./static/state/qualified.png')`;
                    break;
                default:
                    rankStatus.style.backgroundImage = `url('./static/state/unranked.png')`;
                    break;
            }
        };

        if (JSON.stringify(cache['strains']) != JSON.stringify(performance.graph) && chart != '') {
            cache['strains'] = performance.graph;
        
            graph_options.series = performance.graph.series.slice(3, 4).map(r => {
        
                return {
                  name: r.name,
                  data: r.data.map(s => s == -100 ? null : s),
                };
              });
            chart.updateOptions(graph_options);
            chart2.updateOptions(graph_options);
          };

        if (cache['beatmap'] != beatmap) {
            cache['beatmap'] = beatmap;
            SongSelectData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Status</div>
            <div>${beatmap.status.name} (${beatmap.status.number})</div>
            <div>Checksum: ${beatmap.checksum}</div>
            <div>ID: ${beatmap.id} | Set: ${beatmap.set}</div>
            <div>Artist: ${beatmap.artist} (${beatmap.artistUnicode})
            <div>Title: ${beatmap.title} (${beatmap.titleUnicode})
            <div>Mapper: ${beatmap.mapper} (Version: ${beatmap.version})
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Stars</div>
            <div>Aim: ${beatmap.stats.stars.aim}</div>
            <div>Speed: ${beatmap.stats.stars.speed}</div>
            <div>Flashlight: ${beatmap.stats.stars.flashlight}</div>
            <div>SliderFactor: ${beatmap.stats.stars.sliderFactor}</div>
            <div>Total: ${beatmap.stats.stars.total}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">Difficulty</div>
            <div>AR: ${beatmap.stats.ar.converted} (Memory: ${beatmap.stats.ar.original})</div>
            <div>CS: ${beatmap.stats.cs.converted} (Memory: ${beatmap.stats.cs.original})</div>
            <div>OD: ${beatmap.stats.od.converted} (Memory: ${beatmap.stats.od.original})</div>
            <div>HP: ${beatmap.stats.hp.converted} (Memory: ${beatmap.stats.hp.original})</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div style="font-weight: 900; font-size: 32px;">BPM</div>
            <div>Common: ${beatmap.stats.bpm.common}</div>
            <div>Minimum: ${beatmap.stats.bpm.min}</div>
            <div>Maximum: ${beatmap.stats.bpm.max}</div>
            `
            ObjectData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Circles: ${beatmap.stats.objects.circles}</div>
            <div>Sliders: ${beatmap.stats.objects.sliders}</div>
            <div>Spinners: ${beatmap.stats.objects.spinners}</div>
            <div>Holds: ${beatmap.stats.objects.holds}</div>
            <div>Total: ${beatmap.stats.objects.total}</div>
            <div>Max Combo: ${beatmap.stats.maxCombo}</div>
            `
            TimeMapData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Stars Live: ${beatmap.stats.stars.live}</div>
            <div>BPM Live: ${beatmap.stats.bpm.realtime}</div>
            <div>Current Time: ${secondsToHumanReadable(beatmap.time.live)} (${spaceit(beatmap.time.live)})</div>
            <div>First Object: ${secondsToHumanReadable(beatmap.time.firstObject)} (${spaceit(beatmap.time.firstObject)})</div>
            <div>Last Object: ${secondsToHumanReadable(beatmap.time.lastObject)} (${spaceit(beatmap.time.lastObject)})</div>
            <div>MP3 Length: ${secondsToHumanReadable(beatmap.time.mp3Length)} (${spaceit(beatmap.time.mp3Length)})</div>
            `
        }

        if (cache['beatmap.stats.ar.converted'] != beatmap.stats.ar.converted) {
            cache['beatmap.stats.ar.converted'] = beatmap.stats.ar.converted;
            ARText.innerHTML = cache['beatmap.stats.ar.converted'].toFixed(2);
        };
        if (cache['beatmap.stats.cs.converted'] != beatmap.stats.cs.converted) {
            cache['beatmap.stats.cs.converted'] = beatmap.stats.cs.converted;
            CSText.innerHTML = cache['beatmap.stats.cs.converted'].toFixed(2);
        };
        if (cache['beatmap.stats.od.converted'] != beatmap.stats.od.converted) {
            cache['beatmap.stats.od.converted'] = beatmap.stats.od.converted;
            ODText.innerHTML = cache['beatmap.stats.od.converted'].toFixed(2);
            calculate_od(cache['beatmap.stats.od.converted']);
        };
        if (cache['beatmap.stats.hp.converted'] != beatmap.stats.hp.converted) {
            cache['beatmap.stats.hp.converted'] = beatmap.stats.hp.converted;
            HPText.innerHTML = cache['beatmap.stats.hp.converted'].toFixed(2);
        };
        if (cache['stars.live'] != beatmap.stats.stars.live || cache['stars.total'] != beatmap.stats.stars.total) {
            cache['stars.live'] = beatmap.stats.stars.live;
            cache['stars.total'] = beatmap.stats.stars.total;
            starsCurrent.innerHTML = cache['stars.live'];
            starRating.innerHTML = cache['stars.total'] + ` <i class="fas fa-star" style='color: #f7ff4a;'></i>`
        };
        if (cache['beatmap.stats.bpm.common'] != beatmap.stats.bpm.common) {
            cache['beatmap.stats.bpm.common'] = beatmap.stats.bpm.common;
            StatsBPM.innerHTML = cache['beatmap.stats.bpm.common'] + 'BPM';
        };
        if (cache['beatmap.stats.maxCombo'] != beatmap.stats.maxCombo) {
            cache['beatmap.stats.maxCombo'] = beatmap.stats.maxCombo;
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
        if (cache['performance'] != performance) {
            cache['performance'] = performance;
            PerformanceData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>SS: ${performance.accuracy[100]}</div>
            <div>99%: ${performance.accuracy[99]}</div>
            <div>98%: ${performance.accuracy[98]}</div>
            <div>97%: ${performance.accuracy[97]}</div>
            <div>96%: ${performance.accuracy[96]}</div>
            <div>95%: ${performance.accuracy[95]}</div>
            `
        };
        if (cache['h100'] != play.hits['100']) {
            cache['h100'] = play.hits['100'];
            h100.update(cache['h100']);
            h100Text.innerHTML = cache['h100'] + 'x';
            let tickh100 = document.createElement("div");
            tickh100.setAttribute("class", "tickGraph tick100");
            tickh100.style.transform = `translateX(${progressbar}px)`;
            document.getElementById("graph100").appendChild(tickh100);
            if (cache['h100'] > 0) {
                graph100.style.height = "17px";
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
            }, 300);
        };

        if (cache['h50'] != play.hits['50']) {
            cache['h50'] = play.hits['50'];
            h50.update(cache['h50']);
            h50Text.innerHTML = cache['h50'] + 'x';
            let tickh50 = document.createElement("div");
            tickh50.setAttribute("class", "tickGraph tick50");
            tickh50.style.transform = `translateX(${progressbar}px)`;
            document.getElementById("graph50").appendChild(tickh50);
            if (cache['h50'] > 0) {
                graph50.style.height = "17px";
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
            }, 300);
        };
    
        if (cache['h0'] != play.hits['0']) {
            cache['h0'] = play.hits['0'];
            h0.update(cache['h0']);
            h0Text.innerHTML = cache['h0'] + 'x';
            let tickh0 = document.createElement("div");
            tickh0.setAttribute("class", "tickGraph tick0");
            tickh0.style.transform = `translateX(${progressbar}px)`;
            document.getElementById("graph0").appendChild(tickh0);
            if (cache['h0'] > 0) {
                graph0.style.height = "17px";
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
            }, 300);
        };
  
        if (cache['hSB'] !== play.hits.sliderBreaks) {
            cache['hSB'] = play.hits.sliderBreaks;
            hSB.update(cache['hSB']);
            hSBText.innerHTML = cache['hSB'] + 'x';
            rSB.innerHTML = cache['hSB'];
            let tickSB = document.createElement("div");
            tickSB.setAttribute("class", "tickGraph tickSB");
            tickSB.style.transform = `translateX(${progressbar}px)`;
            document.getElementById("graphSB").appendChild(tickSB);
            if (cache['hSB'] > 0) {
                graphSB.style.height = "17px";
                rSB.style.display = 'block';
                JudgeSB.style.display = 'block';
            }
            else {
                graphSB.style.height = "0px";
                rSB.style.display = 'none';
                JudgeSB.style.display = 'none';
            }
            hsbCont.style.backgroundColor = `white`;
            hSBText.style.transform = `scale(85%)`;
            setTimeout(function () {
                hsbCont.style.backgroundColor = `#b8b8b8`;
                hSBText.style.transform = `scale(100%)`;
            }, 300);
        };
        if (cache['play.mods.name'] != play.mods.name || cache['play.mods.number'] != play.mods.number) {
            cache['play.mods.name'] = play.mods.name;
            cache['play.mods.number'] != play.mods.number;
        };
        if (cache['resultsScreen'] != resultsScreen) {
            cache['resultsScreen'] = resultsScreen;
            ResultScreenData.innerHTML =
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Score ID: ${resultsScreen.scoreId}</div>
            <div>Mode: ${resultsScreen.mode.name} (${resultsScreen.mode.number})</div>
            <div>Player Name: ${resultsScreen.playerName}</div>
            <div>Date Played: ${resultsScreen.createdAt}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Score: ${resultsScreen.score}</div>
            <div>Accuracy: ${resultsScreen.accuracy}</div>
            <div>Max Combo: ${resultsScreen.maxCombo}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Geki: ${resultsScreen.hits.geki}</div>
            <div>300: ${resultsScreen.hits[300]}</div>
            <div>Katu: ${resultsScreen.hits.katu}</div>
            <div>100: ${resultsScreen.hits[100]}</div>
            <div>50: ${resultsScreen.hits[50]}</div>
            <div>0: ${resultsScreen.hits[0]}</div>
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>Rank: ${resultsScreen.rank}</div>
            <div>PP: ${resultsScreen.pp.current.toFixed(0)} (FC: ${resultsScreen.pp.fc.toFixed(0)})</div>
            <div>Mods: ${resultsScreen.mods.name} (${resultsScreen.mods.number})</div>
            `
        }
        if (cache['resultsScreen.hits[300]'] != resultsScreen.hits[300]) {
            cache['resultsScreen.hits[300]'] = resultsScreen.hits[300];
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
            if (cache['resultsScreen.name'] == "") {
                LocalResultNameData = cache['LocalNameData'] || 'Kiana';
            }
            else {
                LocalResultNameData = cache['resultsScreen.name'];
            }
            PlayerName.innerHTML = LocalResultNameData;
        };
        if (cache['resultsScreen.mods.name'] != resultsScreen.mods.name || cache['resultsScreen.mods.number'] != resultsScreen.mods.number) {
            cache['resultsScreen.mods.name'] = resultsScreen.mods.name;
            cache['resultsScreen.mods.number'] = resultsScreen.mods.number;
        };
        if (cache['resultScreen.accuracy'] != resultsScreen.accuracy) {
            cache['resultScreen.accuracy'] = resultsScreen.accuracy;
            PlayerAcc.innerHTML = cache['resultScreen.accuracy'] + '%';
        };
        if (cache['resultsScreen.maxCombo'] != resultsScreen.maxCombo) {
            cache['resultsScreen.maxCombo'] = resultsScreen.maxCombo;
            PlayerMaxCombo.innerHTML = cache['resultsScreen.maxCombo'] + ` / ` + cache['beatmap.stats.maxCombo'] + `x`;
        };
        if (cache['resultsScreen.score'] != resultsScreen.score) {
            cache['resultsScreen.score'] = resultsScreen.score;
            PlayerScore.innerHTML = numberWithCommas(cache['resultsScreen.score']);
        };
        if (cache['resultsScreen.rank'] != resultsScreen.rank) {
            cache['resultsScreen.rank'] = resultsScreen.rank;
            rankingResult.innerHTML = cache['resultsScreen.rank'].replace("H", "");
            rankingResult.setAttribute('class', `${resultsScreen.rank}`);
        };
        if (cache['resultsScreen.pp.fc'] != resultsScreen.pp.fc) {
            cache['resultsScreen.pp.fc'] = resultsScreen.pp.fc.toFixed(0);
            PPResultIfFC.innerHTML = `| FC: ` + cache['resultsScreen.pp.fc'] + 'pp';
            if (cache['resultsScreen.hits[0]'] == 0 && cache['hSB'] == 0) {
                PPResultIfFC.style.display = `none`;
            }
            else {
                PPResultIfFC.style.display = `block`;
            }
        };
        if (cache['resultsScreen.pp.current'] != resultsScreen.pp.current) {
            cache['resultsScreen.pp.current'] = resultsScreen.pp.current.toFixed(0);
            PPResult.innerHTML = cache['resultsScreen.pp.current'] + 'pp';
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

        if (cache['BPMLive'] != beatmap.stats.bpm.realtime) {
            cache['BPMLive'] = beatmap.stats.bpm.realtime;
            BPMlive.innerHTML = cache['BPMLive'];
            bpmflash.style.opacity = 0;
            setTimeout(function() {
                bpmflash.style.opacity = 1;
            }, 200);
        };

        const cachedim = settings.background.dim / 100;
        const Folder = cache['folders.beatmap'].replace(/#/g, "%23").replace(/%/g, "%25").replace(/\\/g, "/").replace(/'/g, "%27").replace(/ /g, "%20");
        const Img = cache['files.background'];

        mapBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, ${cachedim}), rgba(0, 0, 0, ${cachedim})), url('http://127.0.0.1:24050/files/beatmap/${Folder}/${Img}')`;
        rankingPanelBG.style.backgroundImage = `url('http://127.0.0.1:24050/files/beatmap/${Folder}/${Img}')`;
        StatsBG.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('http://127.0.0.1:24050/files/beatmap/${Folder}/${Img}')`;

        Song.innerHTML = cache['beatmap.title'];
        Artist.innerHTML = `by ` + cache['beatmap.artist'];
        Mapper.innerHTML = `Mapped by ` + cache['beatmap.mapper'];

        combo_wrapper.style.transform = `translateX(${cache['beatmap.stats.od.converted'] * 13}px)`;
        pp_wrapper.style.transform = `translateX(-${cache['beatmap.stats.od.converted'] * 13}px)`;
        l50.style.width = `${600 - (26.2 * cache['beatmap.stats.od.converted'])}px`;

        if (cache['data.menu.state'] !== 2) {
            if (cache['data.menu.state'] !== 7) { deRankingPanel() };
  
            gptop.style.opacity = 0;
    
            URCont.style.opacity = 0;
            avgHitError.style.transform = "translateX(0)";
    
            gpbottom.style.opacity = 0;
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

            if (cache['beatmap_rankedStatus'] == 4 && cache['LBEnabled'] == true || cache['beatmap_rankedStatus'] == 7 && cache['LBEnabled'] == true || cache['beatmap_rankedStatus'] == 6 && cache['LBEnabled'] == true || cache['beatmap_rankedStatus'] == 5 && cache['LBEnabled'] == true ) {

            setupMapScores(cache['beatmap.id']);

            if (document.getElementById("currentplayerCont"))
                lbcpPosition.setAttribute('class', `positions N${playerPosition}`);

                if (playerPosition > 9) {
                    lbopCont.style.transform = `translateY(${-(playerPosition - 50) * 65}px)`;
                    document.getElementById("currentplayerCont").style.transform = `none`;
                    document.getElementById("lbcpLine").style.transform = `none`;
                } else {
                    lbopCont.style.transform = "translateY(2600px)";
                    document.getElementById("currentplayerCont").style.transform = `translateY(${(playerPosition - 10) * 65}px)`;
                    document.getElementById("lbcpLine").style.transform = `translateY(${(playerPosition - 10) * 65}px)`;
                    document.getElementById("lbcpLine").style.height = `${(playerPosition - 10) * 35 + 1}px`;
                    LBUpTimer = new Date().getTime();
                    previousUpTimer = LBUpTimer
                };
            if (tempSlotLength > 0)
                for (var i = 10; i <= tempSlotLength; i++) {
                    if (i >= playerPosition && playerPosition !== 0 && document.getElementById(`playerslot${i}`)) {
                        document.getElementById(`playerslot${i}`).style.transform = `translateY(65px)`;
                        document.getElementById(`playerslot${i}`).style.opacity = `0`;
                    }
                };
                for (var i = 1; i <= tempSlotLength; i++) {
                    if (i >= playerPosition && playerPosition !== 0 && document.getElementById(`playerslot${i}`)) {
                        document.getElementById(`playerslot${i}`).style.transform = `translateY(65px)`;
                        document.getElementById(`lb_Positions_slot${i}`).innerHTML = `${i + 1}`;
                        document.getElementById(`lb_Positions_slot${i}`).setAttribute('class', `N${i + 1}`);
                    }
                    if (new Date().getTime() - previousUpTimer > previousUpTimer - 1000) {
                        document.getElementById("lbcpLine").style.height = `35px`;
                    }
                };
                console.log(previousUpTimer)
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
            progress100.style.transform = `translateX(${progressbar}px)`;
            progress50.style.transform = `translateX(${progressbar}px)`;
            progress0.style.transform = `translateX(${progressbar}px)`;
            progressSB.style.transform = `translateX(${progressbar}px)`;
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
          combo_box.style.width = `${159 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
        if (cache['play.combo.current'] >= 10000 && cache['play.combo.current'] < 1000) {
          combo_box.style.width = `${179 + (isBreak ? getMaxPxValue(cache['play.combo.max']) : 0)}px`;
        };
  
        function getMaxPxValue(x) {
          if (x < 10) return 75;
          if (x >= 10 && x < 100) return 90;
          if (x >= 100 && x < 1000) return 105;
          if (x >= 1000 && x < 10000) return 125;
        };
  
        function getTranslateValue(x) {
          if (x < 10) return 20;
          if (x >= 10 && x < 100) return 40;
          if (x >= 100 && x < 1000) return 60;
          if (x >= 1000 && x < 10000) return 95;
        };

        let pp_tx = cache['play.pp.current'] + " / " + cache['play.pp.fc'] + "pp";

        if (pp_tx.length == 7) { 
          pp_box.style.width = '155px';
        };
        if (pp_tx.length == 8) { 
          pp_box.style.width = '165px';
        };
        if (pp_tx.length == 9) {
          pp_box.style.width = '195px';
        };
        if (pp_tx.length == 10) {
          pp_box.style.width = '215px';
        };
        if (pp_tx.length == 11) {
          pp_box.style.width = '235px';
        };
        if (pp_tx.length == 12) {
          pp_box.style.width = '265px';
        };
        if (pp_tx.length == 13) {
          pp_box.style.width = '295px';
        };

        if (cache['play.pp.current'] < 10) {
            pp_txt.style.width = "25px";
        };
        if (cache['play.pp.current'] >= 10 && cache['play.pp.current'] < 100) {
            pp_txt.style.width = "48px";
        };
        if (cache['play.pp.current'] >= 100 && cache['play.pp.current'] < 1000) {
            pp_txt.style.width = "70px";
        };
        if (cache['play.pp.current'] >= 1000 && cache['play.pp.current'] < 10000) {
            pp_txt.style.width = "105px";
        };
        if (cache['play.pp.current'] >= 10000 && cache['play.pp.current'] < 1000) {
            pp_txt.style.width = "125px";
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

        if (cache['hp.normal'] > 0) {
            hp.style.clipPath = `polygon(${(1 - cache['hp.normal'] / 100) * 50}% 0%, ${(cache['hp.normal'] / 100) * 50 + 50}% 0%, ${(cache['hp.normal'] / 100) * 50 + 50}% 100%, ${(1 - cache['hp.normal'] / 100) * 50}% 100%)`;
        } else {
            hp.style.clipPath = `polygon(0 0, 93.7% 0, 93.7% 100%, 0 100%)`;
        };

        if (tempMapScores.length > 0) if (cache['play.score'] >= tempMapScores[playerPosition - 2]) playerPosition--;

        if (cache['beatmap.time.live'] >= cache['beatmap.time.lastObject'] + 1000 && cache['data.menu.state'] == 2 || cache['data.menu.state'] == 7) { rankingPanelBG.style.opacity = 1; }
    
        if (rankingPanelBG.style.opacity !== 1 && cache['data.menu.state'] == 2 && cache['beatmap.time.live'] >= cache['beatmap.time.lastObject'] + 1000 || cache['data.menu.state'] == 7) {
            if (!rankingPanelSet) setupRankingPanel();
        } else if (!(cache['beatmap.time.live'] >= cache['beatmap.time.lastObject'] - 500 && cache['data.menu.state'] == 2)) rankingPanelBG.style.opacity = 0 && deRankingPanel();

        async function setupRankingPanel() {
            rankingPanelSet = true;
        
            rankingPanelBG.style.opacity = 1;
            RankingPanel.style.opacity = 1;
        
            ResultMiddle.style.transform = `translateY(0)`;
            MiddleBar.style.height = `460px`;

            rankingResult.style.opacity = 1;
            rankingResult.style.transform = 'scale(100%)';

            TContainer.style.transform = `translateX(0)`;
            PContainer.style.transform = `translateX(0)`;

            modContainer.style.transform = `translateY(0)`;

            MapStats.style.opacity = 1;
            StatsBPM.style.opacity = 1;
            StatsBar.style.opacity = 1;

            MapStats.style.transform = `translateX(0)`;
            StatsBPM.style.transform = `translateX(0)`;
            StatsBar.style.transform = `translateX(0)`;

            CSGlow.style.width = ((cache['beatmap.stats.cs.converted'].toFixed(2) * 10) - 10) + '%';
            ARGlow.style.width = ((cache['beatmap.stats.ar.converted'].toFixed(2) * 10) - 10) + '%';
            ODGlow.style.width = ((cache['beatmap.stats.od.converted'].toFixed(2) * 10) - 10) + '%';
            HPGlow.style.width = ((cache['beatmap.stats.hp.converted'].toFixed(2) * 10) - 10) + '%';

            Top1.style.opacity = 1;
            Top2.style.opacity = 1;
            Top3.style.opacity = 1;
            Top4.style.opacity = 1;
            Top5.style.opacity = 1;
            Top6.style.opacity = 1;

            Top1.style.transform = `translateY(0)`;
            Top2.style.transform = `translateY(0)`;
            Top3.style.transform = `translateY(0)`;
            Top4.style.transform = `translateY(0)`;
            Top5.style.transform = `translateY(0)`;
            Top6.style.transform = `translateY(0)`;
        };
        async function deRankingPanel() {
            rankingPanelSet = false;
        
            rankingPanelBG.style.opacity = 0;
            RankingPanel.style.opacity = 0;
        
            ResultMiddle.style.transform = `translateY(400px)`;
            MiddleBar.style.height = `0px`;

            rankingResult.style.opacity = 0;
            rankingResult.style.transform = 'scale(150%)';

            TContainer.style.transform = `translateX(500px)`;
            PContainer.style.transform = `translateX(-500px)`;

            modContainer.style.transform = `translateY(100px)`;

            MapStats.style.opacity = 0;
            StatsBPM.style.opacity = 0;
            StatsBar.style.opacity = 0;

            MapStats.style.transform = `translateX(-100px)`;
            StatsBPM.style.transform = `translateX(-100px)`;
            StatsBar.style.transform = `translateX(100px)`;

            CSGlow.style.width = `0%`;
            ARGlow.style.width = `0%`;
            ODGlow.style.width = `0%`;
            HPGlow.style.width = `0%`;

            Top1.style.opacity = 0;
            Top2.style.opacity = 0;
            Top3.style.opacity = 0;
            Top4.style.opacity = 0;
            Top5.style.opacity = 0;
            Top6.style.opacity = 0;

            Top1.style.transform = `translateY(-100px)`;
            Top2.style.transform = `translateY(-100px)`;
            Top3.style.transform = `translateY(-100px)`;
            Top4.style.transform = `translateY(-100px)`;
            Top5.style.transform = `translateY(-100px)`;
            Top6.style.transform = `translateY(-100px)`;
        };
        
    } catch (error) {
        console.log(error);
    };
  });

  socket.api_v2_precise((data) => {
    try {
        if (cache['keys'] != data.keys) {
            cache['keys'] = data.keys;
            KeysData.innerHTML = 
            `
            <div style="width: 97%; height: 3px; background-color: #a1c9ff; margin-top: 10px; margin-bottom: 10px;"></div>
            <div>K1: ${data.keys.k1.isPressed} (${data.keys.k1.count})</div>
            <div>K2: ${data.keys.k2.isPressed} (${data.keys.k2.count})</div>
            <div>M1: ${data.keys.m1.isPressed} (${data.keys.m1.count})</div>
            <div>M2: ${data.keys.m2.isPressed} (${data.keys.m2.count})</div>
            `
        }
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
          if (value.isPressed == true) {
            keys[key].registerKeypress();
          };
        };
  
  
        if (cache[`key-${key}-count`] != value.count) {
          document.getElementById(`${key}Count`).innerHTML = value.count;

          cache[`key-${key}-count`] = value.count;
        };
  
  
        if (value.count > 0) {
          document.querySelector(`.keys.${key}`).classList.remove('hidden');
        }
        else {
          document.querySelector(`.keys.${key}`).classList.add('hidden');
        };
      };

      keys.k1.update(data.keys.k1);
      keys.k2.update(data.keys.k2);
      keys.m1.update(data.keys.m1);
      keys.m2.update(data.keys.m2);

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
                borderColor: "rgba(0, 0, 0, 1)",
                borderWidth: "1",
                backgroundColor: "rgba(0, 0, 0, 1)",
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
                tension: 0,
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
                borderColor: "rgba(0, 0, 0, 1)",
                borderWidth: "1",
                backgroundColor: "rgba(0, 0, 0, 1)",
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
                tension: 0,
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

    if (userData.error === null || LocalNameData == cache['LocalNameData']) {
        if (LocalNameData == `dngcheng`) {
            userData = {
                "id": `dngcheng`,
                "statistics": {
                    "global_rank": "17301",
                    "pp": "7146",
                    "country_rank": "156",
                },
                "country_code": "VN",
            }
            playerBest = {
                "0": {
                    "beatmap_id": `2659724`,
                    "pp": `400`,
                    "mods_id": `HD`,
                    "rank": `SH`,
                    "ended_at": `2023-04-05 21:42:34`,
                },
                "1": {
                    "beatmap_id": `1228616`,
                    "pp": `388`,
                    "mods_id": `HD`,
                    "rank": `SH`,
                    "ended_at": `2023-03-10 21:23:45`,
                },
                "2": {
                    "beatmap_id": `307618`,
                    "pp": `384`,
                    "mods_id": `HDDT`,
                    "rank": `SH`,
                    "ended_at": `2022-11-13 15:29:31`,
                },
                "3": {
                    "beatmap_id": `3928577`,
                    "pp": `375`,
                    "mods_id": `HD`,
                    "rank": `SH`,
                    "ended_at": `2023-04-03 19:42:34`,
                },
                "4": {
                    "beatmap_id": `2485186`,
                    "pp": `373`,
                    "mods_id": `HD`,
                    "rank": `A`,
                    "ended_at": `2023-04-11 20:36:14`,
                },
                "5": {
                    "beatmap_id": `550235`,
                    "pp": `369`,
                    "mods_id": `HD`,
                    "rank": `A`,
                    "ended_at": `2023-04-08 20:26:21`,
                }
            };
        }
        else {
            userData = {
                "id": `Kiana`,
                "statistics": {
                    "global_rank": `${cache['GBrank'] || "0"}`,
                    "pp": `${cache['ppGB'] || "0"}`,
                    "country_rank": `${cache['CTrank'] || "0"}`,
                },
                "country_code": `${cache['CTcode'] || "__"}`,
            }
        playerBest = {
            "0": {
                "beatmap_id": `${cache['mapid0'] || ""}`,
                "pp": `${cache['ppResult0'] || ""}`,
                "mods_id": `${cache['modsid0'] || ""}`,
                "rank": `${cache['rankResult0'] |""}`,
                "ended_at": `${cache['date0'] || ""}`,
            },
            "1": {
                "beatmap_id": `${cache['mapid1'] || ""}`,
                "pp": `${cache['ppResult1'] || ""}`,
                "mods_id": `${cache['modsid1'] || ""}`,
                "rank": `${cache['rankResult1'] || ""}`,
                "ended_at": `${cache['date1'] || ""}`,
            },
            "2": {
                "beatmap_id": `${cache['mapid_'] || ""}`,
                "pp": `${cache['ppResult2'] || ""}`,
                "mods_id": `${cache['modsid2'] || ""}`,
                "rank": `${cache['rankResult2'] || ""}`,
                "ended_at": `${cache['date2'] || ""}`,
            },
            "3": {
                "beatmap_id": `${cache['mapid3'] || ""}`,
                "pp": `${cache['ppResult3'] || ""}`,
                "mods_id": `${cache['modsid3'] || ""}`,
                "rank": `${cache['rankResult3'] || ""}`,
                "ended_at": `${cache['date3'] || ""}`,
            },
            "4": {
                "beatmap_id": `${cache['mapid4'] || ""}`,
                "pp": `${cache['ppResult4'] || ""}`,
                "mods_id": `${cache['mods_id4'] || ""}`,
                "rank": `${cache['rankResult4'] || ""}`,
                "ended_at": `${cache['date4'] || ""}`,
            },
            "5": {
                "beatmap_id": `${cache['mapid5'] || ""}`,
                "pp": `${cache['ppResult5'] || ""}`,
                "mods_id": `${cache['mods_id5'] || ""}`,
                "rank": `${cache['rankResult5'] || ""}`,
                "ended_at": `${cache['date5'] || ""}`,
            }
        };
    }
        for (var i = 0; i < 6; i++) {
            if (playerBest[i]["pp"] == "" ||
                playerBest[i]["beatmap_id"] == "" ||
                playerBest[i]["ended_at"] == "" ||
                playerBest[i]["rank"] == "" ||
                playerBest[i]["mods_id"] == "") {
                document.getElementById(`Top${i + 1}`).style.backgroundImage = ``;
                document.getElementById(`TopDate${i + 1}`).innerHTML = ``;
                document.getElementById(`TopRanking${i + 1}`).innerHTML = ``;
                document.getElementById(`topPP${i + 1}`).innerHTML = ``;
                document.getElementById(`TopMods${i + 1}`).innerHTML = ``;
            }
            else {
            let mapData = await getMapDataSet(playerBest[i]["beatmap_id"]);
            document.getElementById(`Top${i + 1}`).style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://assets.ppy.sh/beatmaps/${mapData.beatmapset_id}/covers/cover.jpg')`;
            document.getElementById(`TopDate${i + 1}`).innerHTML = playerBest[i]["ended_at"].replace("T", " ").replace("Z", " ");
            document.getElementById(`TopRanking${i + 1}`).innerHTML = playerBest[i]["rank"].replace("H", "");
            document.getElementById(`TopRanking${i + 1}`).setAttribute("class", `topRanking ${playerBest[i]["rank"]}`);
            document.getElementById(`topPP${i + 1}`).innerHTML = `${Math.round(playerBest[i]["pp"])}pp`;

            let ModsRCount = playerBest[i]['mods_id'].length;
        
            for (var k = 0; k < ModsRCount; k++) {
                let modsR = document.createElement("div");
                modsR.id = playerBest[i]['mods_id'].substr(k, 2) + i;
                modsR.setAttribute("class", `modslb ${playerBest[i]['mods_id'].substr(k, 2)}`);
                modsR.style.backgroundImage = `url('./static/mods/${playerBest[i]['mods_id'].substr(k, 2)}.png')`;
                document.getElementById(`TopMods${i + 1}`).appendChild(modsR);
                k++;
            };
        };
        };
    }
    else {
        playerBest = await getUserTop(userData.id);
        for (var i = 0; i < 6; i++) {
            let mapData = await getMapDataSet(playerBest[i]["beatmap_id"]);
            document.getElementById(`Top${i + 1}`).style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://assets.ppy.sh/beatmaps/${mapData.beatmapset_id}/covers/cover.jpg')`;
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

    if (userData.id == `Kiana`) {
        ava.style.backgroundImage = "url('./static/gamer.png')";
        PlayerAvatar.style.backgroundImage = "url('./static/gamer.png')";
        lbcpAvatar.style.backgroundImage = "url('./static/gamer.png')";
    }
    else if (userData.id == `dngcheng`) {
        ava.style.backgroundImage = "url('./static/dngcheng.png')";
        PlayerAvatar.style.backgroundImage = "url('./static/dngcheng.png')";
        lbcpAvatar.style.backgroundImage = "url('./static/dngcheng.png')";
    } 
    else {
        ava.style.backgroundImage = `url('https://a.ppy.sh/${userData.id}')`;
        PlayerAvatar.style.backgroundImage = `url('https://a.ppy.sh/${userData.id}')`;
        lbcpAvatar.style.backgroundImage = `url('https://a.ppy.sh/${userData.id}')`;
    };

    const tempCountry = `${userData.country_code
        .split("")
        .map((char) => 127397 + char.charCodeAt())[0]
        .toString(16)}-${userData.country_code
        .split("")
        .map((char) => 127397 + char.charCodeAt())[1]
        .toString(16)}`;

    country.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;
    PlayerFlag.style.backgroundImage = `url('https://osu.ppy.sh/assets/images/flags/${tempCountry}.svg')`;

    ranks.innerHTML = "#" + userData.statistics.global_rank;
    PlayerGR.innerHTML = `#` + userData.statistics.global_rank;

    countryRank.innerHTML = "#" + userData.statistics.country_rank;
    PlayerCR.innerHTML = `#${userData.statistics.country_rank} ${userData.country_code}`;

    playerPP.innerHTML = Math.round(userData.statistics.pp) + "pp";
    PlayerTotalPP.innerHTML = Math.round(userData.statistics.pp) + "pp";

    if (cache['ColorSet'] == `API`) {
        let avatarColor
            if (userData.error === null || userData.id == `Kiana`) {
                avatarColor = {
                    "hsl1": [
                        0.5277777777777778,
                        0
                    ],
                    "hsl2": [
                        0.5277777777777778,
                        0
                    ]
                }
            }
            else if (userData.id == `dngcheng`) {
                avatarColor = {
                    "hsl1": [
                        0.5916666666666667,
                        0.5
                    ],
                    "hsl2": [
                        0.5861111111111111,
                        0.5
                    ]
                }
            }
            else {
                avatarColor = await postUserID(userData.id);
            }

    
    if (avatarColor) {
        const ColorData1 = `${avatarColor.hsl1[0] * 360}, ${avatarColor.hsl1[1] * 100}%, 50%`;
        const ColorData2 = `${avatarColor.hsl2[0] * 360}, ${avatarColor.hsl2[1] * 100}%, 75%`;
        const ColorResultLight = `${avatarColor.hsl1[0] * 360}, ${avatarColor.hsl1[1] * 100}%, 82%`;
        const ColorResultDark = `${avatarColor.hsl1[0] * 360}, ${avatarColor.hsl1[1] * 100}%, 6%`;

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

        config.data.datasets[0].backgroundColor = `hsl(${ColorData1})`;
        configSecond.data.datasets[0].backgroundColor = `hsl(${ColorData1})`;

        document.querySelector('.keys.k1').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.k2').style.setProperty('--press', `hsl(${ColorData1})`);
        document.querySelector('.keys.m1').style.setProperty('--press', `hsl(${ColorData2})`);
        document.querySelector('.keys.m2').style.setProperty('--press', `hsl(${ColorData2})`);

        keys.k1.color = `hsla(${ColorData1}, 0.8)`;
        keys.k2.color = `hsla(${ColorData1}, 0.8)`;
        keys.m1.color = `hsla(${ColorData2}, 0.8)`;
        keys.m2.color = `hsla(${ColorData2}, 0.8)`;

        lbcpLine.style.backgroundColor = `hsl(${ColorData1})`;
        lbcpLine.style.boxShadow = `0 0 10px 2px hsla(${ColorData1}, 0.5)`;

        RankingPanel.style.backgroundColor = `hsla(${ColorResultDark}, 0.9)`;

        SonataTextResult.style.color = `hsl(${ColorResultLight})`;
        bgborder.style.border = `3px solid hsl(${ColorResultLight})`;
        StatsBPM.style.border = `3px solid hsl(${ColorResultLight})`;

        CSLine.style.border = `3px solid hsl(${ColorResultLight})`;
        ARLine.style.border = `3px solid hsl(${ColorResultLight})`;
        ODLine.style.border = `3px solid hsl(${ColorResultLight})`;
        HPLine.style.border = `3px solid hsl(${ColorResultLight})`;

        PHCS.style.color = `hsl(${ColorResultLight})`;
        PHAR.style.color = `hsl(${ColorResultLight})`;
        PHOD.style.color = `hsl(${ColorResultLight})`;
        PHHP.style.color = `hsl(${ColorResultLight})`;

        CSGlow.style.backgroundColor = `hsl(${ColorResultLight})`;
        ARGlow.style.backgroundColor = `hsl(${ColorResultLight})`;
        ODGlow.style.backgroundColor = `hsl(${ColorResultLight})`;
        HPGlow.style.backgroundColor = `hsl(${ColorResultLight})`;

        MiddleBar.style.backgroundColor = `hsl(${ColorResultLight})`;
        };
    };
};

async function setupMapScores(beatmapID) {
    if (leaderboardFetch == false) {
        leaderboardFetch = true;
        let data;

        if (cache['LBOptions'] == 'Selected Mods') {
            data = await getModsScores(beatmapID);
            LBTypeAPI.innerHTML = `
            <div style="font-weight: 900; font-size: 25px;">API</div>
            <div>Selected Mods (Mods: ${cache['play.mods.name']})</div>
            `;
        }
        else {
            data = await getMapScores(beatmapID);
            LBTypeAPI.innerHTML = `
            <div style="font-weight: 900; font-size: 25px;">API</div>
            <div>Global</div>
            `
        };

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
                            <div id="lb_Positions_slot${i}" class="positions N${i}">${i}</div>
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
                                <div id="lb_Acc_slot${i}" class="lb_Acc">${data[i - 1].acc}%</div>
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
async function getModsScores(beatmapID) {
    try {
        const data = (
            await axios.get(`/${beatmapID}/mods/${cache['play.mods.name']}`, {
                baseURL: "https://phubahosi.vercel.app/api/beatmap",
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    };
};

function secondsToHumanReadable(seconds) {
  const hours = Math.floor(seconds / 3600000);
  seconds -= hours * 3600000;

  const minutes = Math.floor(seconds / 60000);
  seconds -= minutes * 60000;

  const remainingSeconds = Math.floor(seconds / 1000);

  let result = "";
  if (hours > 0) {
    result += hours + "h";
  }
  if (minutes > 0 || hours > 0) {
    result += minutes + "m";
  }
  result += remainingSeconds + "s";

  return result;
}