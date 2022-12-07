import { useEffect, useMemo, useRef } from "react";
import cytoscape, { Core, ElementsDefinition } from "cytoscape";
import json from "./wheat_network_seedSize.json";

export const useGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core>();
  const elements = useMemo(
    () => [...json.nodes, ...json.edges] as unknown as ElementsDefinition,
    []
  );

  // init graph
  useEffect(() => {
    cyRef.current = cytoscape({
      container: containerRef.current, // container to render in
      elements,
      style: [
        {
          selector: "node",
          style: {
            content: "data(displayValue)",
            /*function(ele) {
                    var label= '';
                    if(ele.data('value').indexOf('<span') > -1) { // For html content from text, use html tags.
                       var txtLabel= '<html>'+ ele.data('value') +'</html>';
                       label= jQuery(txtLabel).text();
                      }
                    else { label= ele.data('value'); }
                    // Trim the label's length.
                    if(label.length> 30) { label= label.substr(0,29)+'...'; }
                    return label;
                   },*/
            //     'text-valign': 'center', // to have 'content' displayed in the middle of the node.
            "text-background-color": "data(conceptTextBGcolor)",
            // "text-background-opacity": "data(conceptTextBGopacity)", //'0', // default: '0' (disabled).
            /*function(ele) { // text background opacity
                  var textBackgroundOpacity= '0';
                  if(ele.data('value').indexOf('<span') > -1) { textBackgroundOpacity= '1'; }
                  return textBackgroundOpacity;
                 },*/
            "text-wrap": 'wrap', // for manual and/or autowrapping the label text.
            //          'edge-text-rotation' : 'autorotate', // rotate edge labels as the angle of an edge changes: can be 'none' or 'autorotate'.
            // "border-style": "data(conceptBorderStyle)", //'solid', // node border, can be 'solid', 'dotted', 'dashed' or 'double'.
            /*function(ele) {
                            var node_borderStyle= 'solid';
                            try { // Check if the node was flagged or not
                            if(ele.data('flagged') === "true") {
                               node_borderStyle= 'double'; // can be 'solid', 'dotted', 'dashed' or 'double'.
      //                                 console.log("node Flagged= "+ ele.data('flagged') +" , node_borderStyle: "+ node_borderStyle);
                              }
                            }
                            catch(err) { console.log(err.stack); }
                            return node_borderStyle;
                        },*/
            "border-width": "data(conceptBorderWidth)", //'1px',
            /*function(ele) {
                            var node_borderWidth= '1px';
                            try { // Check if the node was flagged or not
                            if(ele.data('flagged') === "true") {
                               node_borderWidth= '3px';
      //                                 console.log("node Flagged= "+ ele.data('flagged') +" , node_borderWidth: "+ node_borderWidth);
                              }
                            }
                            catch(err) { console.log(err.stack); }
                            return node_borderWidth;
                        },*/
            "border-color": "data(conceptBorderColor)", //'black',
            /*function(ele) {
                            var node_borderColor= 'black';
                            try { // Check if the node was flagged or not
                            if(ele.data('flagged') === "true") {
                               node_borderColor= 'navy';
      //                                 console.log("node Flagged= "+ ele.data('flagged') +" , node_borderColor: "+ node_borderColor);
                              }
                            }
                            catch(err) { console.log(err.stack); }
                            return node_borderColor;
                        },*/
            "font-size": "16px", // '8px',
            //          'min-zoomed-font-size': '8px',
            // Set node shape, color & display (visibility) depending on settings in the JSON var.
            // shape: "data(conceptShape)", // 'triangle'
            width: "data(conceptSize)", // '18px',
            height: "data(conceptSize)", // '18px',
            "background-color": "data(conceptColor)", // 'gray'
            /** Using 'data(conceptColor)' leads to a "null" mapping error if that attribute is not defined
             * in cytoscapeJS. Using 'data[conceptColor]' is hence preferred as it limits the scope of
             * assigning a property value only if it is defined in cytoscapeJS as well. */
            // display: "data(conceptDisplay)", // display: 'element' (show) or 'none' (hide).
            "text-opacity": 0, // to make the label invisible by default.
          },
        },
        {
          selector: "edge",
          style: {
            content: "data(label)", // label for edges (arrows).
            "font-size": "16px",
            //          'min-zoomed-font-size': '8px',
            "curve-style":
              "unbundled-bezier" /* options: bezier (curved) (default), unbundled-bezier (curved with manual control points), haystack (straight edges) */,
            // "control-point-step-size": "10px", //'1px' // specifies the distance between successive bezier edges.
            // "control-point-distance": "20px" /* overrides control-point-step-size to curves single edges as well, in addition to parallele edges */,
            // "control-point-weight": "50" /*'0.7'*/, // '0': curve towards source node, '1': curve towards target node.
            width: "data(relationSize)", // 'mapData(relationSize, 70, 100, 2, 6)', // '3px',
            //'line-color': 'data(relationColor)', // e.g., 'grey',
            "line-color": "data(relationColor)",
            "line-style": "solid", // 'solid' (or 'dotted', 'dashed')
            "target-arrow-shape": "triangle",
            "target-arrow-color": "gray",
            // display: "data(relationDisplay)", // display: 'element' (show) or 'none' (hide).
            "text-opacity": 0, // to make the label invisible by default.
          },
        },
        {
          selector: ".highlighted",
          style: {
            "background-color": "#61bffc",
            "line-color": "#61bffc",
            "target-arrow-color": "#61bffc",
            "transition-property": "background-color, line-color, target-arrow-color",
            // "transition-duration": "0.5s",
          },
        },
        // { selector ':selected', style: { // settings for highlighting nodes in case of single click or Shift+click multi-select event.
        //   'border-width': '4px',
        //   'border-color': '#CCCC33' // '#333'
        // }}
        // .selector('.BlurNode').css({ // settings for using shadow effect on nodes when they have hidden, connected nodes.
        //       'shadow-blur': '25', // disable for larger network graphs, use x & y offset(s) instead.
        //       'shadow-color': 'black', // 'data(conceptColor)',
        //       'shadow-opacity': '0.9'
        // })
        // .selector('.HideEle').css({ // settings to hide node/ edge
        //       'display': 'none'
        // })
        // .selector('.ShowEle').css({ // settings to show node/ edge
        //       'display': 'element'
        // })
        // .selector('.LabelOn').css({ // settings to show Label on node/ edge
        //       'text-opacity': '1'
        // })
        // .selector('.LabelOff').css({ // settings to show Label on node/ edge
        //       'text-opacity': '0'
        // })
        // .selector('.darkgreyEdge').css({
        //       'line-color': 'darkGrey'
        // })
        // .selector('.orangeEdge').css({
        //       'line-color': 'orange'
        // })
        // .selector('.dashedEdge').css({ // dashed edge
        //       'line-style': 'dashed'
        // })
        // .selector('.FlaggedGene').css({ // to show highlighed label on flagged gene
        //       'text-background-color': '#FFFF00',
        //       'text-background-opacity': '1'
        // });
      ],
      // style: [
      //   // the stylesheet for the graph
      //   {
      //     selector: "node",
      //     style: {
      //       "background-color": "#666",
      //       label: "data(id)",
      //     },
      //   },

      //   {
      //     selector: "edge",
      //     style: {
      //       width: 3,
      //       "line-color": "#ccc",
      //       "target-arrow-color": "#ccc",
      //       "target-arrow-shape": "triangle",
      //       "curve-style": "bezier",
      //     },
      //   },
      // ],

      // layout of the Network: isReloaded (set preset layout), else (for JS vars, do nothing).
      layout: { name: "cose" },

      // this is an alternative that uses a bitmap during interaction.
      textureOnViewport: false, // true,
      /* the colour of the area outside the viewport texture when initOptions.textureOnViewport === true can
       * be set by: e.g., outside-texture-bg-color: white, */

      // interpolate on high density displays instead of increasing resolution.
      pixelRatio: 1,

      // Zoom settings
      zoomingEnabled: true, // zooming: both by user and programmatically.
      //  userZoomingEnabled: true, // user-enabled zooming.
      zoom: 1, // the initial zoom level of the graph before the layout is set.
      //  minZoom: 1e-50, maxZoom: 1e50,
      /* mouse wheel sensitivity settings to enable a more gradual Zooming process. A value between 0 and 1
       * reduces the sensitivity (zooms slower) & a value greater than 1 increases the sensitivity. */
      wheelSensitivity: 0.05,

      panningEnabled: true, // panning: both by user and programmatically.
      //  userPanningEnabled: true, // user-enabled panning.

      // for Touch-based gestures.
      //  selectionType: (isTouchDevice ? 'additive' : 'single'),
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autolock: false,
      autoungrabify: false,
      autounselectify: false,

      // a "motion blur" effect that increases perceived performance for little or no cost.
      motionBlur: true,
    });
  }, [elements]);

  return {
    text: "lala",
    containerRef,
  };
};
