import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }
`;

const Jobs = () => {
  // eslint-disable-next-line no-console
  // const data = useStaticQuery(graphql`
  //   query {
  //     jobs: allMarkdownRemark(
  //       filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
  //       sort: { fields: [frontmatter___date], order: DESC }
  //     ) {
  //       edges {
  //         node {
  //           frontmatter {
  //             title
  //             company
  //             location
  //             range
  //             url
  //           }
  //           html
  //         }
  //       }
  //     }
  //   }
  // `);
  // eslint-disable-next-line no-console
  const data = {
    jobs: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'Cloud Software Engineer',
              company: 'Hanu Software (An Insight Company)',
              location: 'Noida, India',
              range: 'June 2020 - August 2022',
              url: 'https://hanu.com/',
            },
            html:
              '<ul>\n<li>Engaged with a multinational healthcare service provider for end-to-end, designing, implementation, testing, and deployment of monolithic healthcare revenue software to a high-quality multi-tiered production-ready application which ensures reusability, and continuous delivery</li>\n<li>Extracted and implemented legacy services into independent micro-services using well-documented APIs (.Net Core, C#); Implementation of solution removed the tight coupling by 80%</li>\n<li>Led a deployment team of 5 to implement a continuous integration environment on competing priorities for health care revenue software development</li>\n<li>Designed, built, configured, and maintained CI/CD pipelines to sustain high productivity levels. Load-based horizontal/vertical scaling of K8’s pods/Nodes; Setup reverse proxies using Nginx; Implementation resulted in 99.9 % application availability, decreased the server cost by 35 %, and 100% client satisfaction</li>\n</ul>',
          },
        },
        {
          node: {
            frontmatter: {
              title: 'Software/Machine Learning Intern',
              company: 'South Side Medical Services',
              location: 'Noida, India',
              range: 'January 2020 - April 2020',
              url: 'https://www.ssrx.com/',
            },
            html:
              '<ul>\n<li>Accomplished training AI models for classifying pharmacy patients with low adherence levels based on the custom metric (Medical Possession Ratio). Implemented python script for data augmentation; gathered and parsed over a million records of JSON drugs’ data from ’OpenFDA’ API endpoint</li>\n<li>Collaborated with other interns on data augmentation, data cleaning, exploratory data analysis, feature selection, and feature computation; Resulted in the increase in model evaluation metric by 45%</li>\n</ul>',
          },
        },
        {
          node: {
            frontmatter: {
              title: 'Deep Learning R&D Intern',
              company: 'HPC3, UTP',
              location: 'Perak, Malaysia',
              range: 'May 2019 - July 2019',
              url:
                'https://www.utp.edu.my/Pages/Research/Centre%20Of%20Excellence/15%20HP3C/High-Performance-Cloud-Computing-Centre-.aspx',
            },
            html:
              '<ul>\n<li>As a Deep Learning Intern, I was fully responsible to investigate and implement a Neural Network model on private clusters as a surrogate for a meta-heuristic algorithm that aims to solve the time complexity of an expensive genetic algorithm’s fitness function. The resulting model achieves the F-score of  0.9</li>\n<li>•	Analyzed and researched catastrophic forgetting in neural networks where Neural Network severely forgets previous tasks when learning a new one. Regenerated the issues by doing POC on MNIST and Fashion MNIST datasets. Implemented several solutions by ready published research papers on flexible and priority weight training; Resulting in an accuracy of more than 70%.</ul>',
          },
        },
      ],
    },
  };

  const jobsData = data.jobs.edges;
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, go to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Where I’ve Worked</h2>
      <div className="inner">
        <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { company } = node.frontmatter;
              return (
                <StyledTabButton
                  key={i}
                  isActive={activeTabId === i}
                  onClick={() => setActiveTabId(i)}
                  ref={el => (tabs.current[i] = el)}
                  id={`tab-${i}`}
                  role="tab"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-selected={activeTabId === i ? true : false}
                  aria-controls={`panel-${i}`}>
                  <span>{company}</span>
                </StyledTabButton>
              );
            })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsData &&
            jobsData.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, url, company, location, range } = frontmatter;

              return (
                <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link">
                          {company}
                        </a>
                      </span>
                    </h3>
                    <p className="company">{location}</p>
                    <p className="range">{range}</p>
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;
