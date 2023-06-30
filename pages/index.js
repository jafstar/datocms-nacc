import Layout from "../src/components/Layout"
import { request } from "../lib/datocms"
import Link from "next/link"
import Head from "next/head"

import { Container, Row, Col } from "react-bootstrap"
import { StructuredText, useQuerySubscription, renderMetaTags, renderNodeRule } from "react-datocms"
import { isHeading } from "datocms-structured-text-utils"

import { metaTagsFragment, responsiveImageFragment } from "../lib/fragments"
import Hero from "../src/components/Hero"
import Service from "../src/components/Service"
import About from "../src/components/About"

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
export async function getStaticProps({ params, preview = false }) {
  // const graphqlRequest = {
  //   query: `
  //     {
  //       landings: allLandingPages {
  //         heroTitle
  //         slug
  //       }
  //     }
  //         `,
  //   preview,
  // }
  const graphqlRequest = {
    query: `
      {
        landings: allLandingPages(filter: {id: {eq: "10753817"} }) {
          heroTitle
          slug
          heroSubtitle
          heroImage {
            responsiveImage(imgixParams: {fm: jpg, fit: crop }) {
              ...responsiveImageFragment
            }
          }
          content {
            value
            blocks {
              __typename
              ... on SectionRecord {
                id
                content {
                  ...on AboutBlockRecord {
                    __typename
                    title
                    text
                  }
                  ...on TitleBlockRecord {
                    id
                    __typename
                    title
                  }
                  ... on LinksToModelRecord {
                    __typename
                    id
                    links {
                      ... on ServiceRecord {
                        __typename
                        id
                        title
                        text
                        image {
                          responsiveImage(imgixParams: {fm: jpg, fit: crop}) {
                            ...responsiveImageFragment
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      ${responsiveImageFragment}
    `,
    preview,
  }
  return {
    props: {
      subscription: preview
        ? {
          ...graphqlRequest,
          initialData: await request(graphqlRequest),
          token: process.env.DATOCMS_API_READONLY_TOKEN,
          environment: process.env.NEXT_DATOCMS_ENVIRONMENT || null,
        }
        : {
          enabled: false,
          initialData: await request(graphqlRequest),
        },
    },
  }
}
export default function LandingPage({ subscription }) {
  const {
    data: { landings },
  } = useQuerySubscription(subscription)

  // const metaTags = landingPage.seo.concat(site.favicon)
  console.log("landings: ", landings)


  return (
    <Layout pageTitle="NACC">
      {/* <Head>{renderMetaTags(metaTags)}</Head> */}
      <br />
      <br />
      <Hero record={landings[0]} />
      <StructuredText
        data={landings[0].content}
        renderBlock={({ record }) => {

          switch (record.__typename) {
            case "SectionRecord":
              const blocks = record.content.map((rec) => {
                switch (rec.__typename) {
                  // case "StatementRecord":
                  //  return (
                  //  <div className="statement-block row">
                  //   <div className="col-md-10 mx-auto">
                  //   <p className="line-height-1_8">
                  //    {rec.message}
                  //   </p>
                  //   </div>
                  //  </div>
                  // )
                  case "AboutBlockRecord":
                    return <About record={rec} />
                  case "TitleBlockRecord":
                    return (
                      <Col md={10} key={rec.id}>
                        <h2 className="font-weight-light text-center line-height-1_6 text-dark mb-4">{rec.title}</h2>
                        <br />
                      </Col>
                    )
                  case "LinksToModelRecord":
                    return rec.links.map((link) => {
                      if (link.__typename === "ServiceRecord") {
                        return <Service service={link} />
                      }
                    })

                }
              })

              return (
                <section className="section bg-grey-light">
                  <Container>
                    <h2
                      className="text-lg text-dark text-center mb-4"
                      key={record.id}
                    // id={slugify(record.title)}
                    >
                      {record.title}
                    </h2>
                    <p className="text-muted text-center mb-5">{record.text}</p>
                    {blocks.length > 0 && (
                      <Row className="justify-content-center" key={record.id + "-block"}>
                        {blocks}
                      </Row>
                    )}
                  </Container>
                </section>
              )
            default:
              return null
          }
        }}
        customNodeRules={[
          renderNodeRule(isHeading, ({ node, children, key }) => {
            const HeadingTag = `h${node.level}`
            const anchor = toPlainText(node)
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "")

            console.log("foo", anchor)

            return (
              <HeadingTag key={key} id={anchor} className="font-weight-normal text-warning mb-3">
                <a href={`#${anchor}`}>{children}</a>
              </HeadingTag>
            )
          }),
        ]}
      />

      {/* <section className="section" id="services">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <div className="title text-center mb-5 mt-5">
                <h1 className="font-weight-bold text-dark mb-5">
                  <span className="text-warning">All landing pages</span>
                </h1>
                {landings &&
                  landings.map(({ slug, heroTitle }) => {
                    return (
                      <div key={slug} className="text-center mb-2">
                        <Link href={`/landings/${slug}`}>
                          <a>{heroTitle}</a>
                        </Link>
                      </div>
                    )
                  })}
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}
    </Layout>
  )
}
