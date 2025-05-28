// src/components/AboutUsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'react-feather';
import TeamMemberCard from './TeamMemberCard';
// Se você tiver um logo específico para esta página, importe-o
// import logoTaskMaster from '../assets/taskmaster_logo_monochrome-nobg.png';

// Dados fictícios da equipe (substitua pelos seus dados reais)
const teamMembersData = [
    {
        id: 1,
        // Use um serviço como ui-avatars.com ou source.unsplash para placeholders se não tiver fotos
        photoUrl: `https://ui-avatars.com/api/?name=Joao+Pedro&background=D8432D&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'João Pedro Martins',
        course: 'Engenharia de Software - Universidade X',
        role: 'Desenvolvedor Full-Stack ',
        socialLinks: {
            instagram: 'https://www.instagram.com/jpmartins.03/',
            linkedin: 'https://www.linkedin.com/in/jo%C3%A3o-pedro-martins-272a03225/',
            github: 'https://github.com/jpmartins03',
            gmail: 'jpmartinsfs03@gmail.com',
            whatsapp: '5567996169905' // Apenas números para a função getWhatsAppLink
        }
    },
    {
        id: 2,
        photoUrl: `https://ui-avatars.com/api/?name=Membro+Equipe+2&background=7A1B5E&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'Membro da Equipe 2',
        course: 'Design Gráfico - Instituto Y',
        role: 'UI/UX Designer',
        socialLinks: {
            instagram: '#',
            linkedin: '#',
            gmail: 'membro2@exemplo.com',
        }
    },
    {
        id: 3,
        photoUrl: `https://ui-avatars.com/api/?name=Membro+Equipe+3&background=3F0C56&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'Membro da Equipe 3',
        course: 'Engenharia de Software - Estácio',
        role: 'Gerente de Projeto & Quality Assurance',
        socialLinks: {
            linkedin: '#',
            github: '#',
            whatsapp: '5511988887777'
        }
    },
];

const AboutUsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E2A3B] via-[#101A27] to-[#0C141F] text-slate-100 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho da Página */}
                <div className="flex items-center mb-10 relative">
                    <button
                        onClick={() => navigate('/')} // Volta para a LoginPage
                        className="absolute left-0 top-0 p-2 text-slate-300 hover:text-sky-400 transition-colors"
                        title="Voltar para Login"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div className="flex-grow flex flex-col items-center text-center"> {/* Centraliza título e ícone */}
                        <Users size={40} className="text-sky-400 mb-2" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
                            Nossa Equipe
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">Conheça quem está por trás do TaskMaster.</p>
                    </div>
                    <div className="w-10 h-10"></div> {/* Espaçador para balancear o botão voltar */}
                </div>

                {/* Grid de Cards dos Membros */}
                {teamMembersData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                        {teamMembersData.map(member => (
                            <TeamMemberCard
                                key={member.id}
                                photoUrl={member.photoUrl}
                                name={member.name}
                                course={member.course}
                                role={member.role}
                                socialLinks={member.socialLinks}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-400 text-lg mt-10">
                        Informações da equipe não disponíveis no momento.
                    </p>
                )}

                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                    >
                        Voltar para a Página Inicial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;