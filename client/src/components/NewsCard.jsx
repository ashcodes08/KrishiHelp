import React from 'react'

function NewsCard(props) {
    return (
        <div className="news-card mt-10 bg-yellow-50 dark:bg-slate-500 dark:hover:bg-slate-700">
            <div className="news-card flex flex-wrap p-5 gap-1 mb-1">
                <b className="title font-semibold text-lg">{props.title}</b>
                <div className="news-card-img mx-auto">
                    <img src={props.imgUrl} alt="img" className="news-card-img w-full h-auto object-cover" />
                </div>
                <div className="description">
                    <p className="description-text leading-7">
                        {props.description?.substring(0, 200)}...
                    </p>
                </div>
                <div className="info">
                    <div className="src-info flex items-center gap-2">
                        <span className="font-semibold">
                            Source:
                        </span>
                        <a href={props.url}
                           target="_blank"
                           className="link underline break-words"
                        >{props.source.substring(0, 70)}</a>
                    </div>
                    <div className="origin flex flex-col">
                        <p className="origin-item">
                            <span className="font-semibold">Author:</span> {props.author}
                        </p>
                        <p className="origin-item">
                            <span className="font-semibold">Published At:</span> {props.publishedAt}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default NewsCard;
