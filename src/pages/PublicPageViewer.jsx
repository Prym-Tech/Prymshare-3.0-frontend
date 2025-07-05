import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicPage } from '../services/pageService.js';
import { recordEvent } from '../services/analyticsService.js';
import { templates } from '../lib/templates.js';
import Spinner from '../components/ui/Spinner.jsx';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import Logo from '../assets/images/new_logo.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PublicPageViewer = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('page');

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const data = await getPublicPage(slug);
                setPage(data);
                if (data.display_mode === 'store_only') {
                    setActiveTab('store');
                } else {
                    setActiveTab('page');
                }
                recordEvent(slug, 'page_view');
            } catch (err) {
                setError("Page not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId;
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else {
            return null;
        }
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const handleLinkClick = (url) => {
        recordEvent(slug, 'link_click', { url });
    };

    if (loading) {
        return <div className="flex h-screen w-screen items-center justify-center bg-gray-100"><Spinner /></div>;
    }

    if (error) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center text-center p-4 bg-gray-100">
                <h1 className="text-4xl font-bold text-prym-dark-green">Oops! Page Not Found</h1>
                <p className="text-gray-500 mt-2">The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/" className="mt-6 bg-prym-green text-white font-bold py-2 px-6 rounded-lg">Go Home</Link>
            </div>
        );
    }
    
    const theme = page ? { ...templates.default.styles, ...(templates[page.theme_settings.template]?.styles || {}), ...page.theme_settings } : templates.default.styles;
    const pageStyle = {
        backgroundColor: theme.bgColor,
        backgroundImage: `url(${theme.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: theme.textColor,
    };

    const renderHeader = (section) => {
        const { style = 'side_by_side_center', profileImageUrl, bannerImageUrl, description, social_links = {} } = section.content || {};
        const socialIcons = {
            twitter: <FaTwitter />, instagram: <FaInstagram />, facebook: <FaFacebook />,
            linkedin: <FaLinkedin />, tiktok: <FaTiktok />, youtube: <FaYoutube />
        };
        const hasSocials = Object.values(social_links || {}).some(link => link);

        const ProfileImage = ({ sizeClass = 'w-24 h-24' }) => (
            <div className={`${sizeClass} rounded-full`}>
                <img src={profileImageUrl || '[https://placehold.co/128x128/E5E7EB/B0B0B0?text=P](https://placehold.co/128x128/E5E7EB/B0B0B0?text=P)'} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg" />
            </div>
        );

        const BannerImage = () => (
             <div className="h-48 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url(${bannerImageUrl || 'https://placehold.co/800x300/121B00/FFFFFF?text=Welcome'})` }}></div>
        );

        const ProfileInfo = ({ alignment = 'text-center' }) => (
            <div className={`p-4 ${alignment}`}>
                <h1 className="font-bold text-2xl">{page?.brand_name}</h1>
                {page?.title && (
                    <span className="inline-block bg-prym-green/10 text-prym-dark-green text-sm font-semibold my-2 px-4 py-1 rounded-full">
                        {page.title}
                    </span>
                )}
                <p className={`text-sm opacity-80 mt-1 max-w-lg ${alignment === 'text-center' ? 'mx-auto' : ''}`}>{description}</p>
                 {hasSocials && (
                    <div className={`flex items-center space-x-5 mt-4 text-gray-400 ${alignment === 'text-center' ? 'justify-center' : ''}`}>
                        {Object.entries(social_links).map(([key, value]) => value && <a key={key} href={`https://www.${key}.com/${value}`} target="_blank" rel="noopener noreferrer" className="hover:text-prym-pink text-xl">{socialIcons[key]}</a>)}
                    </div>
                 )}
            </div>
        );

        switch(style) {
            case 'banner_overlay': 
                return (
                    <div className="relative text-white text-center rounded-2xl overflow-hidden shadow-lg">
                        <BannerImage />
                        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center p-4">
                            <ProfileImage sizeClass="w-28 h-28" />
                            <h1 className="font-bold text-2xl mt-2">{page?.brand_name}</h1>
                        </div>
                    </div>
                );
            case 'banner_above': 
                return (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg" style={{backgroundColor: theme.blockBgColor}}>
                        <BannerImage />
                        <ProfileInfo />
                    </div>
                );
            case 'card_left_image':
                return (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex items-center gap-4" style={{backgroundColor: theme.blockBgColor}}>
                         <div className="flex-shrink-0"><ProfileImage sizeClass="w-20 h-20" /></div>
                         <div className="flex-grow">
                             <h1 className="font-bold text-xl">{page?.brand_name}</h1>
                             {hasSocials && (
                                <div className="flex items-center space-x-4 mt-2 text-gray-400">
                                    {Object.entries(social_links).map(([key, value]) => value && <a key={key} href={`https://www.${key}.com/${value}`} target="_blank" rel="noopener noreferrer" className="hover:text-prym-pink text-lg">{socialIcons[key]}</a>)}
                                </div>
                             )}
                         </div>
                    </div>
                );
            case 'side_by_side_center': 
            default: 
                return (
                    <div className="flex flex-col items-center text-center">
                        <ProfileImage sizeClass="w-28 h-28" />
                        <ProfileInfo/>
                    </div>
                );
        }
    };

    const renderSection = (section) => {
        const content = section.content || {};
        const blockStyle = theme.template === 'shadow' ? { backgroundColor: theme.blockBgColor, border: '1px solid #E5E7EB' } : { backgroundColor: theme.blockBgColor };
        const linkStyle = { backgroundColor: theme.linkColor, color: theme.linkTextColor };
        const shadowLinkStyle = { ...linkStyle, boxShadow: `4px 4px 0px ${theme.buttonShadowColor}` };
        const actionButtonStyle = { backgroundColor: theme.actionButtonColor, color: theme.actionButtonTextColor };

        const Card = ({ children, className }) => (
            <div className={`my-12 mx-4 lg:m-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 transition-transform hover:scale-[1.01] ${className}`} style={{backgroundColor: theme.blockBgColor}}>
                {children}
            </div>
        );

        switch (section.section_type) {
            case 'links':
                return (
                    <div className=" max-w-3xl mx-4 space-y-4">
                        {(content.links || []).map((link, index) => (
                            <a 
                                key={index} 
                                href={link.url} 
                                onClick={() => handleLinkClick(link.url)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center w-full px-2 py-2 text-white rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02] shadow-lg"
                                style={theme.template === 'shadow' ? shadowLinkStyle : linkStyle}
                            >
                                {/* Circular icon container */}
                                {link.imageUrl && (
                                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full mr-4 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={link.imageUrl} 
                                            alt={link.title} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                )}
                                
                                {/* Link text */}
                                <span className={`text-base font-medium flex-1 truncate ${link.imageUrl ? 'text-left' : 'text-center py-2'}`}>
                                    {link.title || 'Your Link Title'}
                                </span>
                            </a>
                        ))}
                    </div>
                );

            case 'video_carousel':
                const videos = section.content.videos || [];
                if (videos.length === 0) return null;
                return (
                    <Card className="flex flex-col sm:flex-row gap-4">
                        {section.content.title && <h3 className="font-bold mb-2 px-1" style={{color: theme.textColor}}>{section.content.title}</h3>}
                        <div className="p-3 rounded-lg" style={blockStyle}>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation={true}
                            pagination={{ clickable: true }}
                            className="w-full styled-swiper"
                        >
                            {videos.map((video, index) => {
                                const embedUrl = getYoutubeEmbedUrl(video.videoUrl);
                                return (
                                    <SwiperSlide key={index}>
                                        <div className="bg-white p-3 rounded-lg shadow-md ">
                                            <h3 className="font-semibold text-prym-dark-green mb-2 text-sm">{video.title}</h3>
                                            {embedUrl ? <iframe src={embedUrl} title={video.title} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope" allowFullScreen className="w-full aspect-video rounded-md"></iframe> : <div className="w-full aspect-video rounded-md bg-gray-200 flex items-center justify-center text-sm text-gray-500">Invalid URL</div>}
                                            <p className="text-xs text-gray-500 mt-2">{video.description}</p>
                                        </div>
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                        </div>
                    </Card>
                );
            case 'carousel':
                 const slides = section.content.slides || [];
                 if (slides.length === 0) return null;
                 return (
                    <Card className="flex flex-col sm:flex-row gap-4">
                        {section.content.title && <h3 className="font-bold mb-2 px-1" style={{color: theme.textColor}}>{section.content.title}</h3>}
                        <div className="p-3 rounded-lg" style={blockStyle}>
                        <Swiper modules={[Navigation, Pagination]} spaceBetween={10} slidesPerView={1} navigation pagination={{ clickable: true }} className="w-full styled-swiper">
                            {slides.map((slide, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden" >
                                        <div className="w-full aspect-square bg-gray-200"><img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover"/></div>
                                        <div className="p-3">
                                            <h4 className="font-semibold text-prym-dark-green text-sm">{slide.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{slide.description}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        </div>
                    </Card>
                 );
            case 'digital_product':
                return (
                    <Card className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                            {content.cover_image_url && <img src={content.cover_image_url} alt={content.title} className="w-full h-full object-cover rounded-lg" />}
                        </div>
                        <div className="flex-grow flex flex-col">
                            <h4 className="font-bold text-lg">{content.title || 'Digital Product'}</h4>
                            <p className="text-sm opacity-80 line-clamp-2 flex-grow">{content.description || 'Your product description goes here.'}</p>
                            <button className="w-full sm:w-auto sm:self-start mt-3 py-2 px-6 rounded-lg text-sm font-bold" style={actionButtonStyle}>
                                {parseFloat(content.price) > 0 ? `Buy - ₦${content.price}` : 'Download Free'}
                            </button>
                        </div>
                    </Card>
                );
            case 'appointments':
                return (
                    <Card>
                        <h4 className="font-bold text-lg">{content.title || 'Book a 1-on-1 Session'}</h4>
                        <p className="text-sm opacity-80 mt-1">{content.description || 'Choose a date and time that works for you.'}</p>
                        <button className="w-full mt-4 py-3 rounded-lg text-sm font-bold" style={actionButtonStyle}>
                            {parseFloat(content.price) > 0 ? `Book Now - ₦${content.price}` : 'Book for Free'}
                        </button>
                    </Card>
                );
            case 'paywall':
                return (
                    <Card>
                        <h4 className="font-bold text-lg">{content.title || 'Gated Content'}</h4>
                        <p className="text-sm opacity-80 mt-2 line-clamp-2">{content.description || 'Unlock this exclusive content.'}</p>
                        <button className="w-full mt-3 py-2 rounded-lg text-sm font-bold" style={actionButtonStyle}>
                            {parseFloat(content.price) > 0 ? `Unlock for ₦${content.price}` : 'Access for Free'}
                        </button>
                    </Card>
                );
            case 'events':
            case 'masterclass':
                 const tickets = content.tickets || [];
                 let priceDisplay = 'Free';
                 if (section.section_type === 'events' && tickets.length > 0) {
                     const prices = tickets.map(t => parseFloat(t.price)).filter(p => p > 0);
                     if (prices.length > 0) {
                         const minPrice = Math.min(...prices);
                         priceDisplay = `From ₦${minPrice}`;
                     }
                 } else if (section.section_type === 'masterclass' && parseFloat(content.price) > 0) {
                     priceDisplay = `₦${content.price}`;
                 }

                 return (
                    <Card>
                         <div className="w-full h-32 bg-gray-200 rounded-lg mb-4">
                            {content.cover_image_url && <img src={content.cover_image_url} alt={content.title} className="w-full h-full object-cover rounded-lg" />}
                        </div>
                        <h4 className="font-bold text-lg">{content.title || 'My Awesome Event'}</h4>
                        <p className="text-sm opacity-80 mt-1">{new Date(content.event_date).toLocaleString() || 'Event date and time'}</p>
                        <button className="w-full mt-4 py-3 rounded-lg text-sm font-bold" style={actionButtonStyle}>
                            {section.section_type === 'events' ? 'Get Tickets' : 'Register'} - {priceDisplay}
                        </button>
                    </Card>
                );
            case 'lead_capture':
                return (
                    <Card>
                         <h4 className="font-bold text-lg">{content.title || 'Join my mailing list'}</h4>
                         <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            <input type="email" placeholder="Enter your email" className="flex-grow w-full px-3 py-2 border rounded-lg text-sm bg-white/20 placeholder:text-inherit opacity-70" />
                            <button className="py-2 px-4 rounded-lg text-sm font-bold" style={actionButtonStyle}>
                                {content.button_text || 'Subscribe'}
                            </button>
                         </div>
                     </Card>
                );
            default:
                return null;
        }
    };
    
    const StoreContent = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {page.products.map(product => (
                <div key={product.id} className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden group" style={{backgroundColor: theme.blockBgColor}}>
                    <div className="w-full aspect-square bg-gray-200 overflow-hidden">
                        <img 
                            src={product.image || `https://placehold.co/400x400/00D37F/FFFFFF?text=${product.name.charAt(0)}`} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="p-3">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-sm opacity-80">₦{product.price}</p>
                    </div>
                </div>
            ))}
        </div>
    );

    const headerSection = page.sections.find(s => s.section_type === 'header');
    const mainContent = (
        <div className="space-y-4">
            {activeTab === 'page' && page.display_mode !== 'store_only' && (
                page.sections.filter(s => s.section_type !== 'header').map(section => (
                    <div key={section.id}>{renderSection(section)}</div>
                ))
            )}
            {activeTab === 'store' && page.display_mode !== 'page_only' && (
                <StoreContent />
            )}
        </div>
    );

    return (
        <div className="min-h-screen w-full" style={pageStyle}>
            <div className="max-w-6xl mx-auto lg:py-12 lg:px-4">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    <aside className="lg:col-span-1 lg:sticky top-12 self-start">
                        {headerSection && renderHeader(headerSection)}
                    </aside>
                    <main className="lg:col-span-2 mt-8 lg:mt-0">
                         {page.display_mode === 'both' && (
                            <div className="w-full max-w-md mx-auto mb-6 p-1 rounded-full flex gap-2" style={{backgroundColor: theme.linkColor}}>
                                <button onClick={() => setActiveTab('page')} className={`w-1/2 rounded-full py-2 text-sm font-semibold transition-colors ${activeTab === 'page' ? 'bg-white shadow' : 'bg-transparent'}`} style={{color: activeTab === 'page' ? theme.linkTextColor : theme.textColor}}>Page</button>
                                <button onClick={() => setActiveTab('store')} className={`w-1/2 rounded-full py-2 text-sm font-semibold transition-colors ${activeTab === 'store' ? 'bg-white shadow' : 'bg-transparent'}`} style={{color: activeTab === 'store' ? theme.linkTextColor : theme.textColor}}>Store</button>
                            </div>
                        )}
                        {mainContent}
                    </main>
                </div>
            </div>
            <footer className="text-center py-8">
                <Link to="/" className="inline-block opacity-70 hover:opacity-100 transition-opacity">
                    <img src={Logo} alt="Prymshare" className="h-8 w-auto"/>
                </Link>
            </footer>
        </div>
    );
};

export default PublicPageViewer;