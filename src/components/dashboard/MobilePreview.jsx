import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { pageSectionsAtom, activePageAtom } from '../../state/pageAtoms.js';
import { useProducts } from '../../hooks/useProducts.js';
import { templates } from '../../lib/templates.js';
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const generateTimeSlots = (start, end, duration) => {
    const slots = [];
    if (!start || !end || !duration) return slots;
    
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    const durationMinutes = parseInt(duration, 10);

    if (isNaN(durationMinutes) || durationMinutes <= 0) return slots;

    while (currentTime < endTime) {
        slots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        currentTime.setMinutes(currentTime.getMinutes() + durationMinutes);
    }
    return slots;
};

const MobilePreview = () => {
    const sections = useAtomValue(pageSectionsAtom);
    const activePage = useAtomValue(activePageAtom);
    const [activePreviewTab, setActivePreviewTab] = useState('page');
    const { products } = useProducts(activePage?.id);

    const theme = activePage ? { ...templates.default.styles, ...(templates[activePage.theme_settings.template]?.styles || {}), ...activePage.theme_settings } : templates.default.styles;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        if (activePage?.display_mode === 'store_only') {
            setActivePreviewTab('store');
        } else {
            setActivePreviewTab('page');
        }
    }, [activePage?.display_mode]);

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
    
    const renderHeader = (section) => {
        const { style = 'photo_top', profileImageUrl, bannerImageUrl, description, social_links = {} } = section.content || {};
        const socialIcons = {
            twitter: <FaTwitter />, instagram: <FaInstagram />, facebook: <FaFacebook />,
            linkedin: <FaLinkedin />, tiktok: <FaTiktok />, youtube: <FaYoutube />
        };
        const hasSocials = Object.values(social_links || {}).some(link => link);

        const ProfileImage = ({ sizeClass = 'w-24 h-24' }) => (
            <div className={`${sizeClass} rounded-full bg-gray-200`}>
                <img src={profileImageUrl || 'https://placehold.co/128x128/00D37F/FFFFFF?text=P'} alt="Profile" className="w-full h-full rounded-full object-cover" />
            </div>
        );

        const BannerImage = () => (
             <div className="h-32 bg-gray-300 bg-cover bg-center" style={{ backgroundImage: `url(${bannerImageUrl || 'https://placehold.co/600x200/121B00/FFFFFF?text=Banner'})` }}></div>
        );

        const ProfileInfo = () => (
            <div className="p-4 text-center">
                <h1 className="font-bold text-lg" style={{ color: theme.textColor }}>{activePage?.brand_name}</h1>
                {activePage?.title && (
                    <span className="inline-block bg-prym-green/10 text-prym-dark-green text-xs font-semibold my-2 px-3 py-1 rounded-full">
                        {activePage.title}
                    </span>
                )}
                <p className="text-sm mt-1" style={{ color: theme.textColor }}>{description}</p>
                 {hasSocials && (
                    <div className="flex justify-center items-center space-x-4 mt-3 text-gray-400">
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
                            <h1 className="font-bold text-2xl mt-2">{activePage?.brand_name}</h1>
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
                             <h1 className="font-bold text-xl">{activePage?.brand_name}</h1>
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

    const renderSectionPreview = (section) => {
        const content = section.content || {};
        const blockStyle = theme.template === 'shadow' ? { backgroundColor: theme.blockBgColor, border: '1px solid #E5E7EB' } : { backgroundColor: theme.blockBgColor };
        const linkStyle = { backgroundColor: theme.linkColor, color: theme.linkTextColor };
        const shadowLinkStyle = { ...linkStyle, boxShadow: `4px 4px 0px ${theme.buttonShadowColor}` };
        const actionButtonStyle = { backgroundColor: theme.actionButtonColor, color: theme.actionButtonTextColor };

        const isEventType = section.section_type === 'events';

        switch (section.section_type) {
            case 'links':
                return (
                    <div className="p-2 space-y-2">
                        {(section.content.links || []).map((link, index) => (
                            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" 
                            className="flex items-center w-full p-2 rounded-lg text-left font-semibold truncate shadow-md hover:scale-[1.03] transition-transform"
                            style={theme.template === 'shadow' ? shadowLinkStyle : linkStyle}
                         >
                                {link.imageUrl ? (
                                    <>
                                        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md mr-3">
                                            <img src={link.imageUrl} alt={link.title} className="w-full h-full object-cover rounded-md" />
                                        </div>
                                        <span className="text-sm">{link.title || 'Your Link Title'}</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-center w-full">{link.title || 'Your Link Title'}</span>
                                )}
                            </a>
                        ))}
                    </div>
                );
            case 'video_carousel':
                const videos = section.content.videos || [];
                if (videos.length === 0) return null;
                return (
                    <div className="p-2">
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
                    </div>
                );
            case 'carousel':
                 const slides = section.content.slides || [];
                 if (slides.length === 0) return null;
                 return (
                    <div className="p-2">
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
                    </div>
                 );
            case 'digital_product':
                return (
                    <div className="p-2">
                        <div className="block p-3 rounded-lg shadow-md" style={linkStyle}>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                                    {section.content.cover_image_url && <img src={section.content.cover_image_url} alt={section.content.title} className="w-full h-full object-cover rounded-md" />}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-sm">{section.content.title || 'Digital Product'}</h4>
                                    <p className="text-xs opacity-80 line-clamp-2">{section.content.description || 'Your product description goes here.'}</p>
                                </div>
                            </div>
                            <button className="w-full mt-3 py-2 rounded-md text-sm font-bold" style={actionButtonStyle}>
                                {parseFloat(section.content.price) > 0 ? `Buy for ₦${section.content.price}` : 'Download for Free'}
                            </button>
                        </div>
                    </div>
                );
            case 'appointments':
                const availability = content.availability || {};
                const availableDays = Object.keys(availability).filter(day => availability[day].active);
                const today = new Date();
                const nextThreeDays = Array.from({ length: 4 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    return date;
                }).filter(date => availableDays.includes(date.toLocaleDateString('en-US', { weekday: 'long' })));

                const selectedDayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
                const timeSlots = availability[selectedDayName]?.active 
                    ? generateTimeSlots(availability[selectedDayName].start, availability[selectedDayName].end, content.duration || 30)
                    : [];

                return (
                    <div className="p-2">
                        <div className="block p-4 rounded-lg shadow-md" style={linkStyle}>
                            {content.cover_image_url && (
                                <div className="w-full h-24 bg-gray-200 rounded-md mb-3">
                                    <img src={content.cover_image_url} alt={content.title} className="w-full h-full object-cover rounded-md" />
                                </div>
                            )}

                            <h4 className="font-bold text-lg">{content.title || 'Book a 1-on-1 Session'}</h4>
                            <p className="text-sm opacity-80 mt-1">{content.description || 'Choose a date and time that works for you.'}</p>
                            
                            <div className="mt-4">
                                <p className="font-semibold text-sm mb-2">Available dates</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {nextThreeDays.map(date => (
                                        <button 
                                            key={date.toISOString()}
                                            onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                            className={`p-2 rounded-lg border-2 text-center ${selectedDate.toDateString() === date.toDateString() ? 'border-prym-pink bg-prym-pink/10' : 'border-gray-200'}`}
                                        >
                                            <p className="text-xs font-bold">{date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                                            <p className="text-lg font-bold">{date.getDate()}</p>
                                            <p className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="font-semibold text-sm mb-2">Available openings</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map(slot => (
                                        <button 
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`p-2 rounded-lg border-2 text-center text-xs font-semibold ${selectedTime === slot ? 'border-prym-pink bg-prym-pink/10' : 'border-gray-200'}`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                    {timeSlots.length === 0 && <p className="col-span-3 text-xs text-center text-gray-500">No openings for this day.</p>}
                                </div>
                            </div>
                            
                            <button className="w-full mt-4 py-3 rounded-lg text-sm font-bold disabled:opacity-50" style={actionButtonStyle} disabled={!selectedTime}>
                                {parseFloat(content.price) > 0 ? `Book for ₦${content.price}` : 'Book Session'}
                            </button>
                        </div>
                    </div>
                );
            case 'paywall':
                return (
                    <div className="p-2">
                        <div className="block p-3 rounded-lg shadow-md" style={linkStyle}>
                            <h4 className="font-bold text-sm">{section.content.title || 'Gated Content'}</h4>
                            <p className="text-xs opacity-80 mt-2 line-clamp-2">{section.content.description || 'Unlock this exclusive content.'}</p>
                            <button className="w-full mt-3 py-2 rounded-md text-sm font-bold" style={actionButtonStyle}>
                                {parseFloat(section.content.price) > 0 ? `Unlock for ₦${section.content.price}` : 'Access for Free'}
                            </button>
                        </div>
                    </div>
                );

                case 'events':
                    case 'masterclass':
                         const tickets = content.tickets || [];
                         let priceDisplay = 'Free';
                         if (isEventType && tickets.length > 0) {
                             const prices = tickets.map(t => parseFloat(t.price)).filter(p => p >= 0);
                             if (prices.length > 0) {
                                 const minPrice = Math.min(...prices);
                                 priceDisplay = `From ₦${minPrice}`;
                             }
                         } else if (!isEventType && parseFloat(content.price) > 0) {
                             priceDisplay = `₦${content.price}`;
                         }
        
                         return (
                            <div className="p-2">
                                <div className="block p-3 rounded-lg shadow-md" style={linkStyle}>
                                     <div className="w-full h-24 bg-gray-200 rounded-md mb-3">
                                        {content.cover_image_url && <img src={content.cover_image_url} alt={content.title} className="w-full h-full object-cover rounded-md" />}
                                    </div>
                                    <h4 className="font-bold text-sm">{content.title || 'My Awesome Event'}</h4>
                                    <p className="text-xs opacity-80 mt-1">{new Date(content.event_date).toLocaleString() || 'Event date and time'}</p>
                                    <button className="w-full mt-3 py-2 rounded-md text-sm font-bold" style={actionButtonStyle}>
                                        {section.section_type === 'events' ? 'Get Tickets' : 'Register'} - {priceDisplay}
                                    </button>
                                </div>
                            </div>
                        );
            case 'lead_capture':
                return (
                    <div className="p-2">
                         <div className="block p-3 rounded-lg shadow-md" style={linkStyle}>
                             <h4 className="font-bold text-sm">{content.title || 'Join my mailing list'}</h4>
                             <div className="flex gap-2 mt-3">
                                <input type="email" placeholder="Enter your email" className="flex-grow w-full px-3 py-2 border rounded-md text-sm bg-white/20 placeholder:text-inherit opacity-70" />
                                <button className="py-2 px-4 rounded-md text-sm font-bold" style={actionButtonStyle}>
                                    {content.button_text || 'Subscribe'}
                                </button>
                             </div>
                         </div>
                    </div>
                );
            default:
                return <div className="p-2"><div className="w-full h-16 bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center text-sm text-gray-400 capitalize">{section.section_type} Preview</div></div>;
        }
    };

    const StorePreview = () => (
        <div className="p-2 grid grid-cols-2 gap-2">
            {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="w-full aspect-square bg-gray-200">
                        <img 
                            src={product.image || `https://placehold.co/128x128/00D37F/FFFFFF?text=${product.name.charAt(0)}`} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-2">
                        {/* --- CHANGE START --- */}
                        {/* Added specific text color to ensure visibility on all themes */}
                        <p className="font-semibold text-xs truncate text-prym-dark-green">{product.name}</p>
                        <p className="text-xs text-gray-600">₦{product.price}</p>
                        {/* --- CHANGE END --- */}
                    </div>
                </div>
            ))}
        </div>
    );
    
    const headerSection = sections.find(s => s.section_type === 'header');

    const pageStyle = {
        backgroundColor: theme.bgColor,
        backgroundImage: theme.template === 'image_bg' && theme.backgroundImageUrl ? `url(${theme.backgroundImageUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="w-full max-w-[280px] h-[580px] bg-white rounded-[34px] shadow-2xl p-3 border-8 border-gray-800">
            <style>
                {`
                    .styled-swiper .swiper-button-next, .styled-swiper .swiper-button-prev {
                        color: ${theme.textColor};
                        background-color: ${theme.blockBgColor === 'transparent' ? 'rgba(255, 255, 255, 0.7)' : theme.blockBgColor};
                        border-radius: 9999px;
                        width: 28px;
                        height: 28px;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    .styled-swiper .swiper-button-next::after, .styled-swiper .swiper-button-prev::after {
                        font-size: 12px;
                        font-weight: bold;
                    }
                    .styled-swiper .swiper-pagination-bullet-active {
                        background-color: ${theme.actionButtonColor};
                    }
                `}
            </style>
            <div className="w-full h-full rounded-[22px] overflow-y-auto" style={pageStyle}>
                {headerSection && renderHeader(headerSection)}
                
                {activePage?.display_mode === 'both' && (
                    <div className="sticky top-0 z-10 p-2" style={{backgroundColor: theme.bgColor}}>
                        <div className="flex w-full bg-gray-500/10 p-1 rounded-lg">
                            <button 
                                onClick={() => setActivePreviewTab('page')} 
                                className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${activePreviewTab === 'page' ? 'bg-white shadow' : ''}`} 
                                style={{color: activePreviewTab === 'page' ? theme.linkTextColor : theme.textColor, backgroundColor: activePreviewTab === 'page' ? theme.linkColor : 'transparent'}}>
                                Page
                            </button>
                            <button 
                                onClick={() => setActivePreviewTab('store')} 
                                className={`w-1/2 rounded-md py-1 text-sm font-semibold transition-colors ${activePreviewTab === 'store' ? 'bg-white shadow' : ''}`} 
                                style={{color: activePreviewTab === 'store' ? theme.linkTextColor : theme.textColor, backgroundColor: activePreviewTab === 'store' ? theme.linkColor : 'transparent'}}>
                                Store
                            </button>
                        </div>
                    </div>
                )}

                {activePreviewTab === 'page' && activePage?.display_mode !== 'store_only' && (
                    sections.filter(s => s.section_type !== 'header').map(section => (
                        <div key={section.id}>{renderSectionPreview(section)}</div>
                    ))
                )}
                
                {activePreviewTab === 'store' && activePage?.display_mode !== 'page_only' && (
                    <StorePreview />
                )}
            </div>
        </div>
    );
};
export default MobilePreview;