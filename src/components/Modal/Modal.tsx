import React from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import {ThemeContext} from 'styled-components';
import {BiCodeAlt} from 'react-icons/bi';
import {FaRegEye} from 'react-icons/fa';

// styles
import ModalPage from './styles';

interface ModalProps {
  projectName: string;
  urlRepository: string;
  urlSite?: string;
  background: string;
}

type LanguagesProps = [
  {
    name: string;
    percentage: string;
  },
];

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({projectName, background, urlRepository, urlSite}: ModalProps, ref) => {
    // context
    const {colors} = React.useContext(ThemeContext);
    const [projectDescription, setProjectDescription] = React.useState('');

    let lineChart: any;
    const buildChart = (languages: LanguagesProps) => {
      let canvas = document.getElementById('LineChart') as HTMLCanvasElement;
      let ctx = canvas.getContext('2d');
      if (typeof lineChart !== 'undefined') lineChart.destroy();

      const labelsChart = languages.map(language => language.name);
      const dataDatasetChart = languages.map(language => language.percentage);

      const getOrCreateTooltip = chart => {
        let tooltipEl = chart.canvas.parentNode.querySelector('div');

        if (!tooltipEl) {
          tooltipEl = document.createElement('div');
          tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
          tooltipEl.style.borderRadius = '6px';
          tooltipEl.style.color = 'white';
          tooltipEl.style.fontSize = '12px';
          tooltipEl.style.opacity = 1;
          tooltipEl.style.pointerEvents = 'none';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.transform = 'translate(-50%, 0)';
          tooltipEl.style.transition = 'all .1s ease';

          const table = document.createElement('table');
          table.style.margin = '0px';

          tooltipEl.appendChild(table);
          chart.canvas.parentNode.appendChild(tooltipEl);
        }

        return tooltipEl;
      };

      const externalTooltipHandler = context => {
        // Tooltip Element
        const {chart, tooltip} = context;
        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
          tooltipEl.style.opacity = 0;
          return;
        }

        // Set Text
        if (tooltip.body) {
          const titleLines = tooltip.title || [];
          const bodyLines = tooltip.body.map(b => b.lines);

          const tableHead = document.createElement('thead');

          titleLines.forEach(title => {
            const tr = document.createElement('tr');
            tr.style.borderWidth = '0';

            const th = document.createElement('th');
            th.style.borderWidth = '0';
            const text = document.createTextNode(title);

            th.appendChild(text);
            tr.appendChild(th);
            tableHead.appendChild(tr);
          });

          const tableBody = document.createElement('tbody');
          bodyLines.forEach((body, i) => {
            const colors = tooltip.labelColors[i];

            const span = document.createElement('span');
            span.style.background = colors.backgroundColor;
            span.style.borderColor = colors.borderColor;
            span.style.borderWidth = '2px';
            span.style.marginRight = '10px';
            span.style.height = '10px';
            span.style.width = '10px';
            span.style.display = 'inline-block';

            const tr = document.createElement('tr');
            tr.style.backgroundColor = 'inherit';
            tr.style.borderWidth = '0';

            const td = document.createElement('td');
            td.style.borderWidth = '0';

            const text = document.createTextNode(body + '%');

            td.appendChild(span);
            td.appendChild(text);
            tr.appendChild(td);
            tableBody.appendChild(tr);
          });

          const tableRoot = tooltipEl.querySelector('table');

          // Remove old children
          while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
          }

          // Add new children
          tableRoot.appendChild(tableHead);
          tableRoot.appendChild(tableBody);
        }

        const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding =
          tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
      };

      const dataChart = {
        labels: labelsChart,
        datasets: [
          {
            label: 'Languages',
            data: dataDatasetChart,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 0,
            borderWidth: 0,
          },
        ],
      };

      lineChart = new Chart(ctx, {
        type: 'doughnut',
        options: {
          responsive: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: colors.text,
              },
            },
            tooltip: {
              enabled: false,
              position: 'nearest',
              external: externalTooltipHandler,
            },
            title: {
              display: true,
              text: 'Languages',
              color: colors.text,
            },
          },
        },
        data: dataChart,
      });
    };

    const getDataFromRepository = async () => {
      if (urlRepository !== null) {
        const regex = 'api.github.com/repos';
        const apiGithub = urlRepository.replace(/github.com/g, regex);

        const languagesResponse = await axios.get(`${apiGithub}/languages`);
        try {
          let total = 0;
          let languages: LanguagesProps = [{name: '', percentage: ''}];

          // console.log(languagesRef.current);
          for (let language in languagesResponse.data) {
            total += languagesResponse.data[language];
          }

          for (let language in languagesResponse.data) {
            languages.push({
              name: language,
              percentage: (
                (languagesResponse.data[language] * 100) /
                total
              ).toFixed(1),
            });
          }

          languages.shift();

          buildChart(languages);
        } catch (err) {
          console.error(err);
        }
        const infoRepository = await axios.get(`${apiGithub}`);
        try {
          setProjectDescription(infoRepository.data.description);
        } catch (err) {
          console.error(err);
        }
      }
    };

    React.useEffect(() => {
      getDataFromRepository();
    }, []);

    return (
      <ModalPage.Container>
        <ModalPage.Area ref={ref}>
          <ModalPage.Charts>
            <canvas id="LineChart"></canvas>
          </ModalPage.Charts>

          <ModalPage.Content>
            <ModalPage.Cover Background={background} />

            <main>
              <p>{projectName}</p>
              <p>{projectDescription}</p>
            </main>

            <footer>
              {urlSite === '' ? (
                <button type="button" disabled={true}>
                  <FaRegEye /> Preview
                </button>
              ) : (
                <button type="button">
                  <a href={urlSite} target="_blank">
                    <FaRegEye /> Preview
                  </a>
                </button>
              )}
              <button type="button">
                <a href={urlRepository} target="_blank">
                  <BiCodeAlt /> Source
                </a>
              </button>
            </footer>
          </ModalPage.Content>
        </ModalPage.Area>
      </ModalPage.Container>
    );
  },
);

export default Modal;
